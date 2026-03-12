import type { Request, Response } from 'express';
import { createWebhook, getRepositories } from '../lib/github';
import { db } from '../db';
import { repository } from '../db/schema';
import { eq } from 'drizzle-orm';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';
import logger from '../utils/logger.utils';
import { randomUUID } from 'crypto';
import { inngest } from '../inngest/client';

//* Controller to get repositories from GitHub API
const fetchRepositories = async (req: Request, res: Response) => {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    // Fetch repositories from GitHub API
    const githubRepos = await getRepositories(page, perPage, req);

    // Fetch connected repositories from database
    const dbRepos = await db
      .select()
      .from(repository)
      .where(eq(repository.userId, session.user.id));

    // Create a Set of connected GitHub IDs for efficient lookup
    const connectedReposIds = new Set(dbRepos.map(repo => repo.githubId));

    // Map GitHub repos and add connection status
    const reposWithStatus = githubRepos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      private: repo.private,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      connected: connectedReposIds.has(repo.id),
    }));

    return res.status(200).json({
      success: true,
      data: reposWithStatus,
      pagination: {
        page,
        perPage,
      },
    });
  } catch (error) {
    logger.error('Error fetching repositories:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch repositories',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

//* Controller to connect a GitHub repository to the system
const connectRepository = async (req: Request, res: Response) => {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Validate authentication
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract repository details from request body
    const { owner, repo, githubId } = req.body;

    // Validate required fields
    if (!owner || !repo || !githubId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Check if user can connect more repo
    // Incomplete: enforce repository connection limit based on subscription/usage plan

    // Create webhook in GitHub repository
    const webhook = await createWebhook(owner, repo, req);

    // If webhook creation succeeded, store repository in database
    if (webhook) {
      await db.insert(repository).values({
        id: randomUUID(),
        githubId: Number(githubId), // Ensure githubId is stored as number
        name: repo,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      });
    }

    // TODO: Increment repository count for usage tracking
    // Incomplete: update user's usage statistics / subscription usage table

    // Trigger repository indexing for RAG
    try {
      await inngest.send({
        name: 'repository.connected',
        data: {
          owner,
          repo,
          userId: session.user.id,
        },
      });
    } catch (error) {
      logger.error('Failed to trigger repository indexing:', error);
    }

    return res.status(200).json({
      success: true,
      message: 'Repository connected successfully',
      data: webhook,
    });
  } catch (error) {
    logger.error('Error connecting repository:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect repository',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export { fetchRepositories, connectRepository };
