import { Redis } from "ioredis";

export class RedisClient {
    private readonly redisClient: Redis;

    constructor() {

        this.redisClient = new Redis({
            host: process.env.REDIS_HOST! || "redis",
            username: process.env.REDIS_SERVICE_NAME || "default",
            password: process.env.REDIS_PASSWORD! || "auth",
            port: 6379,
            maxRetriesPerRequest: null,
            tls: process.env.REDIS_HOST ? {} : undefined,
        });

        this.initialize();
    }

    private initialize() {
        this.redisClient.on("error", (err) => {
            console.error("Redis connection error:", err);
        });

        this.redisClient.on("connect", () => {
            console.log("Connected to Redis");
        });
    }

    getClient(): Redis {
        return this.redisClient;
    }
}

export const redisClient = new RedisClient();
