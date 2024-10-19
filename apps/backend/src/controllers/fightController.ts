import prisma from '@repo/db/client';
import kafkaClient from '@repo/kafka/client';
import { MATCHMAKING } from '@repo/topics/topic';
import { Request, Response } from 'express';

const getRecentFights = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const fighter = await prisma.fighter.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!fighter) {
      return res.status(404).json({
        message: 'Fighter profile not found',
      });
    }

    const recentFights = await prisma.fightStat.findMany({
      where: {
        OR: [
          {
            fighter1Id: fighter.id,
          },
          {
            fighter2Id: fighter.id,
          },
        ],
      },

      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        fighter1: {
          select: {
            name: true,
          },
        },
        fighter2: {
          select: {
            name: true,
          },
        },
        winner: true,
        method: true,
        event: true,
      },
    });

    return res.status(200).json({
      data: recentFights,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const initiateMatchmaking = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const fighter = await prisma.fighter.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!fighter) {
      return res.status(404).json({
        message: 'Fighter profile not found',
      });
    }

    await kafkaClient.createTopic(MATCHMAKING);
    const producer = kafkaClient.getInstance().producer();
    await producer.connect();

    producer.send({
      topic: MATCHMAKING,
      messages: [{ value: JSON.stringify({ userId: userId }) }],
    });

    return res.status(202).json({ message: 'Matchmaking initiated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export { getRecentFights, initiateMatchmaking };
