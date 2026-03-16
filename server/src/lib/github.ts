import { Octokit } from 'octokit';
import { auth } from './auth';
import { db } from '../db';
import { account, repository, review } from '../db/schema';
import { fromNodeHeaders } from 'better-auth/node';
import { eq, and } from 'drizzle-orm';
import type { Request } from 'express';
import logger from '../utils/logger.utils';
import { env } from '../config/env.config';
import { inngest } from '../inngest/client';

//* Retrieves the GitHub access token for the authenticated user from the database.
async function getGithubToken(req: Request): Promise<string> {
  // Get session from request headers
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Query the account table for GitHub account of this user
  const [githubAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, session.user.id), eq(account.providerId, 'github')))
    .limit(1);

  if (!githubAccount?.accessToken) {
    throw new Error('No GitHub access token found');
  }

  return githubAccount.accessToken;
}

//* Fetches a user's contribution calendar from GitHub GraphQL API.
async function fetchUserContributions(token: string, username: string) {
  const octokit = new Octokit({ auth: token });

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;
  try {
    const response: any = await octokit.graphql(query, { username });
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    logger.error('GitHub GraphQL error:', error);
    throw new Error('Failed to fetch contributions');
  }
}

//* Fetches a user's repositories from GitHub API.
async function getRepositories(page: number = 1, perPage: number = 10, req: Request) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      direction: 'desc',
      visibility: 'all',
      per_page: perPage,
      page: page,
    });

    return data;
  } catch (error) {
    logger.error('GitHub API error:', error);
    throw new Error('Failed to fetch repositories');
  }
}

//* Creates a webhook for a repository on GitHub.
async function createWebhook(owner: string, repo: string, req: Request) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${env.PUBLIC_APP_BASE_URL}api/webhook/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingHook = hooks.find(hook => hook.config?.url === webhookUrl);

    if (existingHook) {
      return existingHook;
    }

    const { data } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
      events: ['pull_request'],
    });

    return data;
  } catch (error) {
    logger.error('Failed to create webhook:', error);
    throw new Error('Webhook creation failed');
  }
}

//* Deletes a webhook for a repository on GitHub.
async function deleteWebhook(owner: string, repo: string, req: Request) {
  try {
    const token = await getGithubToken(req);
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${env.PUBLIC_APP_BASE_URL}api/webhook/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const hookToDelete = hooks.find(hook => hook.config?.url === webhookUrl);

    if (!hookToDelete) {
      return { success: false };
    }

    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: hookToDelete.id,
    });

    return { success: true };
  } catch (error) {
    logger.error('Failed to delete webhook:', error);
    throw new Error('Webhook deletion failed');
  }
}

//* Fetches the contents of all files in a repository.
async function getRepoFileContents(
  token: string,
  owner: string,
  repo: string,
  path: string = ''
): Promise<{ path: string; content: string }[]> {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (!Array.isArray(data)) {
      if (data.type === 'file' && data.content) {
        return [
          {
            path: data.path,
            content: Buffer.from(data.content, 'base64').toString('utf-8'),
          },
        ];
      }
      return [];
    }

    let files: { path: string; content: string }[] = [];
    for (const file of data) {
      if (file.type === 'file') {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if (!Array.isArray(fileData) && fileData.type === 'file' && fileData.content) {
          if (!file.path.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|pdf|zip|tar|gz|exe|dll|bin)$/i)) {
            files.push({
              path: file.path,
              content: Buffer.from(fileData.content, 'base64').toString('utf-8'),
            });
          }
        }
      } else if (file.type === 'dir') {
        const subFiles = await getRepoFileContents(token, owner, repo, file.path);

        files = files.concat(subFiles);
      }
    }
    return files;
  } catch (error) {
    logger.error('Failed to get repository file contents:', error);
    throw new Error('Failed to get repository file contents');
  }
}

//* Fetches the diff of a pull request.
async function getPullRequestDiff(token: string, owner: string, repo: string, prNumber: number) {
  try {
    const octokit = new Octokit({ auth: token });
    const { data: pr } = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });

    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff',
      },
    });

    return {
      diff: diff as unknown as string,
      title: pr.title,
      description: pr.body || '',
    };
  } catch (error) {
    logger.error('Failed to get pull request diff:', error);
    throw new Error('Failed to get pull request diff');
  }
}

//* Reviews a pull request.
async function reviewPullRequest(owner: string, repo: string, prNumber: number) {
  try {
    const repoData = await db.query.repository.findFirst({
      where: eq(repository.fullName, `${owner}/${repo}`),
      with: {
        user: {
          with: {
            accounts: {
              where: eq(account.providerId, 'github'),
            },
          },
        },
      },
    });

    if (!repoData) {
      throw new Error(
        `Repository ${owner}/${repo} not found in database. Please reconnect the repository.`
      );
    }

    const githubAccount = repoData.user.accounts[0];
    if (!githubAccount?.accessToken) {
      throw new Error(`No GitHub access token found for user ${repoData.user.id}.`);
    }

    const token = githubAccount.accessToken;
    const { title } = await getPullRequestDiff(token, owner, repo, prNumber);

    await inngest.send({
      name: 'pr.review.requested',
      data: { owner, repo, prNumber, userId: repoData.user.id },
    });

    return { success: true, message: 'PR review queued successfully' };
  } catch (error) {
    logger.error('Failed to review pull request:', error);

    try {
      const repoData = await db.query.repository.findFirst({
        where: eq(repository.fullName, `${owner}/${repo}`),
      });

      if (repoData) {
        await db.insert(review).values({
          repositoryId: repoData.id,
          prNumber,
          prTitle: 'Failed to fetch PR',
          prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          review: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 'failed',
        });
      }
    } catch (dbError) {
      logger.error('Failed to insert review in db:', dbError);
    }

    throw error;
  }
}

//* Posts a review comment on a pull request.
export async function postReviewComment(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
  review: string
) {
  try {
    const octokit = new Octokit({ auth: token });
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: `## 🤖 AI Code Review \n\n${review}\n\n---\n*Powered by DebugDeer* 🦌`,
    });
  } catch (error) {
    logger.error('Failed to post review comment:', error);
    throw new Error('Failed to post review comment');
  }
}

export {
  getGithubToken,
  fetchUserContributions,
  getRepositories,
  createWebhook,
  deleteWebhook,
  getRepoFileContents,
  reviewPullRequest,
  getPullRequestDiff,
};
