import kafkaClient from '@repo/kafka/client';
import { MATCHMAKING } from '@repo/topics/topic';
import * as tf from '@tensorflow/tfjs';
import prisma from '@repo/db/client';

async function initiateMatchmaking(userId: number) {
  const fighter = await prisma.fighter.findFirst({ where: { userId: userId } });
  if (!fighter) {
    throw new Error('Fighter not found');
  }
  console.log(fighter.name);

  const potentialOpponents = await prisma.fighter.findMany({
    where: {
      id: { not: fighter.id },
      gender: fighter.gender,
    },
  });

  let bestMatch = null;
  let bestScore = 0;

  for (const opponent of potentialOpponents) {
    const hasRecentMatch = await checkRecentMatches(
      fighter.id,
      opponent.id,
      10
    );
    if (hasRecentMatch) {
      continue;
    }

    const score = await predictMatch(fighter, opponent);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = opponent;
    }
  }

  if (bestMatch) {
    await prisma.upcomingMatch.create({
      data: {
        fighter1Id: fighter.id,
        fighter2Id: bestMatch.id,
        status: 'pending',
        matchDate: new Date(),
      },
    });
    console.log(
      `Matchmaking successful: Fighter1 (${fighter.name}) vs Fighter2 (${bestMatch.name})`
    );
  } else {
    console.log('No suitable match found');
  }
}

async function checkRecentMatches(
  fighter1Id: number,
  fighter2Id: number,
  numMatches: number
): Promise<boolean> {
  const recentMatches = await prisma.upcomingMatch.findMany({
    where: {
      OR: [
        { fighter1Id: fighter1Id, fighter2Id: fighter2Id },
        { fighter1Id: fighter2Id, fighter2Id: fighter1Id },
      ],
      status: 'completed',
    },
    orderBy: { matchDate: 'desc' },
    take: numMatches,
  });

  return recentMatches.length > 0;
}

async function predictMatch(fighter1: any, fighter2: any): Promise<number> {
  const ageWeight = 0.2;
  const heightWeight = 0.2;
  const reachWeight = 0.2;
  const weightWeight = 0.2;
  const experienceWeight = 0.2;

  const fighter1Tensor = tf.tensor([
    fighter1.age,
    fighter1.heightCm,
    fighter1.reachCm,
    fighter1.weightKg,
    fighter1.experienceYears,
  ]);

  const fighter2Tensor = tf.tensor([
    fighter2.age,
    fighter2.heightCm,
    fighter2.reachCm,
    fighter2.weightKg,
    fighter2.experienceYears,
  ]);

  const distanceTensor = tf.sub(fighter1Tensor, fighter2Tensor).square().sum();
  const distance = (await distanceTensor.data())[0];
  const matchScore = 1 / (1 + distance!);
  return matchScore;
}

async function main() {
  try {
    await kafkaClient.createTopic(MATCHMAKING);
    const consumer = kafkaClient
      .getInstance()
      .consumer({ groupId: 'mm-group' });
    await consumer.connect();

    await consumer.subscribe({ topic: MATCHMAKING, fromBeginning: false });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Message received: ${message.value?.toString()}`);

        const data = JSON.parse(message.value?.toString() || '{}');
        const userId = data.userId;

        if (userId) {
          try {
            await initiateMatchmaking(userId);
          } catch (err) {
            console.error(`Error in matchmaking for user ${userId}:`, err);
          }
        }
      },
    });
  } catch (e) {
    console.error(e);
  }
}

main();
