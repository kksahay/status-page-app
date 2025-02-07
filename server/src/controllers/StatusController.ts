import type { Context } from "hono";
import { BaseController } from "./BaseController.js";
import { StatusQueries } from "../utils/queries/StatusQueries.js";
import { Service, Status } from "../utils/types/index.js";
import type { Redis } from "ioredis";
import { redisClient } from "../configs/RedisClient.js";

export class StatusController extends BaseController {
    private readonly statusQueries: StatusQueries;
    private readonly redis: Redis;

    constructor() {
        super();
        this.redis = redisClient.getClient();
        this.statusQueries = new StatusQueries();
    }

    async getStatus(c: Context) {
        try {
            const userId = c.req.param("userId");
            const services = await this.statusQueries.execGetStatus(parseInt(userId)) as Service[];
            const statusList: Status[] = [];
            for (const service of services) {
                const serviceStatus = new Status();
                const { service_id, title, status } = service;
                serviceStatus.service_id = service_id;
                serviceStatus.title = title;
                serviceStatus.currentStatus = status;
                const key = `user:${userId}:service:${service_id}`;
                const latestStatuses = await this.redis.lrange(key, 0, -1);
                serviceStatus.statuses = latestStatuses.map((item) => parseInt(item));
                statusList.push(serviceStatus);
            }
            return c.json(statusList, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }
}