import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.clientGet = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });
  }

  isAlive() {
    // returns true when the connection to Redis is a success otherwise, false
    return this.client.connected;
  }

  async get(key) {
    // takes a string key as argument and returns the Redis value stored for this key
    const val = await this.clientGet(key);
    return val;
  }

  async set(key, value, duration) {
    // takes a string key, a value and a duration in second as arguments
    // to store it in Redis (with an expiration set by the duration argument)
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    // takes a string key as argument and remove the value in Redis for this key
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
