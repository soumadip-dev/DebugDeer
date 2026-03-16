import type { Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth';
import { logger } from 'better-auth';
import { db } from '../db';
import { review, repository } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const getReviews = async (req: Request, res: Response) => {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      logger.error('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get reviews for the user's repositories
    const reviewsData = await db
      .select({
        id: review.id,
        prNumber: review.prNumber,
        prTitle: review.prTitle,
        prUrl: review.prUrl,
        review: review.review,
        status: review.status,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        repository: {
          id: repository.id,
          name: repository.name,
          fullName: repository.fullName,
          url: repository.url,
        },
      })
      .from(review)
      .innerJoin(repository, eq(review.repositoryId, repository.id))
      .where(eq(repository.userId, session.user.id))
      .orderBy(desc(review.createdAt))
      .limit(50);

    return res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: reviewsData,
    });
  } catch (error) {
    logger.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
