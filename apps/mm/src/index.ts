import kafkaClient from '@repo/kafka/client';
import { MATCHMAKING } from '@repo/topics/topic';
import prisma from '@repo/db/client';
import * as tf from '@tensorflow/tfjs';

/*
Matchmaking Process Details:

1. Uses **Euclidean distance** in a **K-Nearest Neighbors (KNN)** style to compare fighters.
   - Calculates the distance between the current fighter and potential opponents based on their physical attributes:
     - Age
     - Height
     - Reach
     - Weight

2. Finds the **best match** by selecting the opponent with the **smallest distance** (i.e., the closest physical match).

3. Creates a match with the selected opponent and sets the match status to **"pending"**.
*/

async function getLastAndUpcomingMatches(fighterId: number): Promise<any[]> {
  const matches = await prisma.upcomingMatch.findMany({
    where: {
      AND: [
        {
          OR: [{ fighter1Id: fighterId }, { fighter2Id: fighterId }],
        },
        {
          OR: [{ status: 'completed' }, { status: 'pending' }],
        },
      ],
    },
    orderBy: {
      matchDate: 'desc',
    },
    take: 5,
  });

  return matches;
}

async function hasFoughtOrScheduledMatch(
  fighter1Id: number,
  fighter2Id: number
): Promise<boolean> {
  const lastMatches = await getLastAndUpcomingMatches(fighter1Id);

  return lastMatches.some(
    (match) =>
      match.fighter1Id === fighter2Id || match.fighter2Id === fighter2Id
  );
}

function getFighterTensor(fighter: any) {
  return tf.tensor([
    fighter.age,
    fighter.heightCm,
    fighter.reachCm,
    fighter.weightKg,
  ]);
}

function knnMatch(fighterTensor: tf.Tensor, opponents: any[]): any {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const opponent of opponents) {
    const opponentTensor = getFighterTensor(opponent);
    const distance = tf.norm(fighterTensor.sub(opponentTensor)).dataSync()[0];

    if (distance !== undefined && distance < bestScore) {
      bestScore = distance;
      bestMatch = opponent;
    }
  }

  return bestMatch;
}

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

  const validOpponents = [];
  for (const opponent of potentialOpponents) {
    const hasFought = await hasFoughtOrScheduledMatch(fighter.id, opponent.id);
    if (!hasFought) {
      validOpponents.push(opponent);
    }
  }

  if (validOpponents.length === 0) {
    console.log('No suitable match found');
    return;
  }

  const fighterTensor = getFighterTensor(fighter);
  const bestMatch = knnMatch(fighterTensor, validOpponents);

  if (bestMatch) {
    await prisma.upcomingMatch.create({
      data: {
        fighter1Id: fighter.id,
        fighter2Id: bestMatch.id,
        status: 'pending',
        matchDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    });
    console.log(
      `Matchmaking successful: Fighter1 (${fighter.name}) vs Fighter2 (${bestMatch.name})`
    );
  } else {
    console.log('No suitable match found');
  }
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
