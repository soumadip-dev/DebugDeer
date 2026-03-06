import type { Request, Response } from 'express';
import { auth } from '../lib/auth.ts';
import logger from '../utils/logger.utils.ts';
import { db } from '../db';
import { fromNodeHeaders } from 'better-auth/node';
import { eq, desc, and } from 'drizzle-orm';
import { repository, user } from '../db/schema.ts';
import { deleteWebhook } from '../lib/github.ts';

//* Controller to get user profile
async function getUserProfile(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userAccount = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!userAccount) {
      logger.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: userAccount,
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to update user profile
async function updateUserProfile(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email } = req.body as {
      name?: string;
      email?: string;
    };

    const existingUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!existingUser) {
      logger.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        error: 'No fields provided for update',
      });
    }

    if (email && email !== existingUser.email) {
      const emailExists = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    const updatedUser = await db
      .update(user)
      .set({
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
      })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser[0],
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to get connected repositories
async function getConnectedRepositories(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const connectedRepositories = await db.query.repository.findMany({
      where: eq(repository.userId, session.user.id),
      columns: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: (repository, { desc }) => [desc(repository.createdAt)],
    });

    return res.status(200).json({
      success: true,
      message: 'Connected repositories fetched successfully',
      data: connectedRepositories,
    });
  } catch (error) {
    logger.error('Error fetching connected repositories:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch connected repositories',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to disconnect a repository
async function disconnectRepository(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { repositoryId } = req.params as { repositoryId: string };

    if (!repositoryId) {
      return res.status(400).json({
        success: false,
        error: 'Repository ID is required',
      });
    }

    const repo = await db.query.repository.findFirst({
      where: and(eq(repository.id, repositoryId), eq(repository.userId, session.user.id)),
    });

    if (!repo) {
      logger.error('Repository not found');
      return res.status(404).json({
        success: false,
        error: 'Repository not found',
      });
    }

    const owner = repo.fullName.split('/')[0];

    if (!owner) {
      return res.status(500).json({
        success: false,
        error: 'Invalid repository full name',
      });
    }

    await deleteWebhook(owner, repo.name, req);

    await db
      .delete(repository)
      .where(and(eq(repository.id, repositoryId), eq(repository.userId, session.user.id)));

    return res.status(200).json({
      success: true,
      message: 'Repository disconnected successfully',
    });
  } catch (error) {
    logger.error('Error disconnecting repository:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to disconnect repository',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

//* Controller to disconnect all repositories
async function disconnectAllRepositories(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const repositories = await db.query.repository.findMany({
      where: eq(repository.userId, session.user.id),
    });

    await Promise.all(
      repositories.map(async repo => {
        const owner = repo.fullName.split('/')[0];
        if (!owner) {
          return;
        }
        await deleteWebhook(owner, repo.name, req);
      })
    );

    await db.delete(repository).where(eq(repository.userId, session.user.id));

    return res.status(200).json({
      success: true,
      message: 'All repositories disconnected successfully',
    });
  } catch (error) {
    logger.error('Error disconnecting all repositories:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to disconnect all repositories',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

export {
  getUserProfile,
  updateUserProfile,
  getConnectedRepositories,
  disconnectRepository,
  disconnectAllRepositories,
};
