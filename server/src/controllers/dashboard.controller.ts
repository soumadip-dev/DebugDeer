import type { Request, Response } from 'express';
import { Octokit } from 'octokit';
import { getGithubToken, fetchUserContributions } from '../lib/github';
import { db } from '../db';
import { and, gte, eq } from 'drizzle-orm';
import logger from '../utils/logger.utils';

//* Controller to get dashboard stats (total commits, total PRs, total reviews, total repos)
async function getDashboardStats(req: Request, res: Response) {
  try {
    // Get GitHub token for the user
    const token = await getGithubToken(req);

    // Create Octokit instance
    const octokit = new Octokit({ auth: token });

    // Get authenticated GitHub user info
    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // TODO: FETCH TOTAL CONNECTED REPO FROM DB
    const totalRepos = 30; // Placeholder

    // Fetch contribution calendar
    const calendar = await fetchUserContributions(token, githubUser.login);
    const totalCommits = calendar?.totalContributions || 0;

    // Count total PRs via GitHub search
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${githubUser.login} type:pr`,
      per_page: 1, // we only need total_count
    });
    const totalPRs = prs.total_count;

    // TODO: Count total AI reviews from your database
    const totalReviews = 44; // Placeholder

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

    // Get the actual github username from github api
    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // Fetch contribution calendar
    const calendar = await fetchUserContributions(token, githubUser.login);

    // Prepare month names and initialize last 6 months
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

    // Initialize last 6 months
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

    // Fetch PRs from the last 6 months via GitHub search
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: Fetch reviews from your database for the last 6 months - for now sample reviews
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // Generate random reviews over the past 6 months
      for (let i = 0; i < 45; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach(review => {
      const monthKey = monthNames[review.createdAt.getMonth()] as string;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

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

    // Transform to array for frontend
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

export { getDashboardStats, getMonthlyActivity };
