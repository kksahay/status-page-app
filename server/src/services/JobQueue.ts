import { Queue, Worker } from "bullmq";
import type { Service } from "../utils/types/Service.js";
import { redisClient } from "../configs/RedisClient.js";
import type { Redis } from "ioredis";
import { JobQueries } from "../utils/queries/JobQueries.js";
import type { Server } from "socket.io";
import { SocketConnection } from "../configs/SocketConnection.js";

export class JobQueue {
    public queue: Queue;
    public worker: Worker;
    private readonly jobQueries: JobQueries;
    private redis: Redis;
    private io!: Server;

    constructor() {
        this.redis = redisClient.getClient();
        this.queue = new Queue("services-monitor", { connection: this.redis });
        this.worker = new Worker("services-monitor", this.checkServices.bind(this), { connection: this.redis });
        this.jobQueries = new JobQueries();
    }

    public async enqueue() {
        console.log("Monitoring job schedules");
        this.io = SocketConnection.getIO();
        await this.queue.add("endpoints-monitor", {}, {
            repeat: {
                every: 60 * 1000,
            },
            removeOnComplete: true,
        })
    }

    private async checkServices() {
        const services = await this.jobQueries.execGetAllServices() as Service[];

        for (const service of services) {
            const { service_id, created_by, endpoint } = service;
            const key = `user:${created_by}:service:${service_id}`;
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    await this.redis.lpush(key, 1);
                    await this.redis.ltrim(key, 0, 44);
                    this.io.emit(`service-update:${created_by}`, { service_id, status: 1 });
                } else {
                    throw Error();
                }
            } catch (error) {
                const lastTwo = await this.redis.lrange(key, 0, 1);
                if (lastTwo.length === 2 && lastTwo[0] === "0" && lastTwo[1] === "0") {
                    await this.jobQueries.execDowngradeService(service_id);
                }
                await this.redis.lpush(key, 1);
                await this.redis.ltrim(key, 0, 44);
                this.io.emit(`service-update:${created_by}`, { service_id, status: 0 });
            }
        }
    }
}