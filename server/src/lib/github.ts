import { Octokit } from 'octokit';
import { auth } from './auth';
import { db } from '../db';
import { account } from '../db/auth-schema';
import { fromNodeHeaders } from 'better-auth/node';
import { eq, and } from 'drizzle-orm';
import type { Request } from 'express';
import logger from '../utils/logger.utils';

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

export { getGithubToken, fetchUserContributions };
