import type { Request, Response } from 'express';
import { auth } from '../lib/auth.ts';
import logger from '../utils/logger.utils.ts';
import { db } from '../db';
import { fromNodeHeaders } from 'better-auth/node';
import { eq } from 'drizzle-orm';
import { user } from '../db/schema.ts';

//* Controller to get user profile
const getUserProfile = async (req: Request, res: Response) => {
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
};

//* Controller to update user profile
const updateUserProfile = async (req: Request, res: Response) => {
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
};

export { getUserProfile, updateUserProfile };
