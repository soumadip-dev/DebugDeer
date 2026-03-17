import type { Request, Response } from 'express';
import { Octokit } from 'octokit';
import { getGithubToken, fetchUserContributions } from '../lib/github';
import { db } from '../db';
import { and, gte, eq, count } from 'drizzle-orm';
import { repository, review } from '../db/schema';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';
import logger from '../utils/logger.utils';

//* Controller to get contribution graph data
async function getContributionGraph(req: Request, res: Response) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const { data: githubUser } = await octokit.rest.users.getAuthenticated();
    const username = githubUser.login;

    const calendar = await fetchUserContributions(token, username);

    if (!calendar) {
      return res.status(404).json({
        message: 'Contribution graph not found',
      });
    }

    const contributions = calendar.weeks.flatMap((week: any) =>
      week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    );

    res.status(200).json({
      message: 'Contribution graph fetched successfully',
      data: { contributions, totalContributions: calendar.totalContributions },
    });
  } catch (error) {
    logger.error('Error in getContributionGraph:', error);
    res.status(500).json({
      error: 'Failed to fetch contribution graph',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to get dashboard stats (total commits, total PRs, total reviews, total repos)
async function getDashboardStats(req: Request, res: Response) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // Get session to identify the user
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch total connected repos from DB
    const [repoCountResult] = await db
      .select({ count: count() })
      .from(repository)
      .where(eq(repository.userId, session.user.id));

    const totalRepos = repoCountResult?.count ?? 0;

    // Fetch contribution calendar
    const calendar = await fetchUserContributions(token, githubUser.login);
    const totalCommits = calendar?.totalContributions || 0;

    // Count total PRs via GitHub search
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${githubUser.login} type:pr`,
      per_page: 1,
    });
    const totalPRs = prs.total_count;

    // Count total AI reviews from DB (via the user's connected repositories)
    const userRepos = await db
      .select({ id: repository.id })
      .from(repository)
      .where(eq(repository.userId, session.user.id));

    const userRepoIds = userRepos.map(r => r.id);

    let totalReviews = 0;
    if (userRepoIds.length > 0) {
      const [reviewCountResult] = await db.select({ count: count() }).from(review).where(
        // inArray is used here — add to imports if not present
        // Alternatively, join approach below avoids inArray:
        eq(review.repositoryId, review.repositoryId) // placeholder — see join below
      );
      // Better: use a join to count reviews for this user's repos
      const [reviewCount] = await db
        .select({ count: count() })
        .from(review)
        .innerJoin(repository, eq(review.repositoryId, repository.id))
        .where(eq(repository.userId, session.user.id));

      totalReviews = reviewCount?.count ?? 0;
    }

    res.status(200).json({
      message: 'Dashboard stats fetched successfully',
      data: {
        totalCommits,
        totalPRs,
        totalReviews,
        totalRepos,
      },
    });
  } catch (error) {
    logger.error('Error in getDashboardStats:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to get monthly activity for the last 6 months (commits, PRs, reviews)
async function getMonthlyActivity(req: Request, res: Response) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const calendar = await fetchUserContributions(token, githubUser.login);

    const monthNames: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const now = new Date();
    const monthlyData: Record<string, { commits: number; prs: number; reviews: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth()] as string;
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    // Aggregate commits from contribution calendar
    if (calendar?.weeks) {
      calendar.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          const date = new Date(day.date);
          const monthKey = monthNames[date.getMonth()] as string;
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].commits += day.contributionCount;
          }
        });
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Fetch reviews from DB for the last 6 months
    const reviews = await db
      .select({ createdAt: review.createdAt })
      .from(review)
      .innerJoin(repository, eq(review.repositoryId, repository.id))
      .where(and(eq(repository.userId, session.user.id), gte(review.createdAt, sixMonthsAgo)));

    reviews.forEach(r => {
      const monthKey = monthNames[r.createdAt.getMonth()] as string;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    // Fetch PRs from the last 6 months via GitHub search
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${githubUser.login} type:pr created:>${sixMonthsAgo.toISOString().split('T')[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()] as string;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    const result = Object.keys(monthlyData).map(name => ({
      name,
      ...monthlyData[name],
    }));

    res.status(200).json({
      message: 'Monthly activity fetched successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error in getMonthlyActivity:', error);
    res.status(500).json({
      error: 'Failed to fetch monthly activity',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export { getDashboardStats, getMonthlyActivity, getContributionGraph };
