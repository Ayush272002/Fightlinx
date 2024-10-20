import { RedisClientType, createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export class RedisManager {
  private client: RedisClientType;
  private publisher: RedisClientType;
  private static instance: RedisManager;

  private constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.connect();

    this.publisher = createClient({ url: process.env.REDIS_URL });
    this.publisher.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }

    return this.instance;
  }

  public async publish(channel: string, message: string) {
    await this.publisher.publish(channel, message);
    //   console.log(`Published message: ${message}`);
  }
}
