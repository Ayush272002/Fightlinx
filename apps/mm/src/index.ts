import kafkaClient from '@repo/kafka/client';
import { MATCHMAKING } from '@repo/topics/topic';

async function main() {
  try {
    const consumer = kafkaClient.consumer({ groupId: 'mm-group' });
    await consumer.connect();

    await consumer.subscribe({ topic: MATCHMAKING, fromBeginning: true });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value?.toString(),
        });
      },
    });
  } catch (e) {
    console.error(e);
  }
}

main();
