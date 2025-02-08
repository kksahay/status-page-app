import { Queue, Worker } from "bullmq";
import type { Service } from "../utils/types/Service.js";
import { redisClient } from "../configs/RedisClient.js";
import type { Redis } from "ioredis";
import { JobQueries } from "../utils/queries/JobQueries.js";
import type { Server } from "socket.io";
import { SocketConnection } from "../configs/SocketConnection.js";

export class JobQueue {
    public queue: Queue;
    public serviceWorker: Worker;
    public maintenanceWorker: Worker;
    private readonly jobQueries: JobQueries;
    private redis: Redis;
    private io!: Server;

    constructor() {
        this.redis = redisClient.getClient();
        this.queue = new Queue("jobs-monitor", { connection: this.redis });
        this.serviceWorker = new Worker("jobs-monitor", this.checkServices.bind(this), { connection: this.redis });
        this.maintenanceWorker = new Worker("jobs-monitor", this.checkMaintenance.bind(this), { connection: this.redis });
        this.jobQueries = new JobQueries();
    }

    public async enqueue() {
        console.log("Monitoring job schedules");
        this.io = SocketConnection.getIO();
        await this.queue.add("endpoints-monitor", {}, {
            repeat: {
                every: 5 * 1000,
            },
            removeOnComplete: true,
        });
        await this.queue.add("maintenance-check", {}, {
            repeat: {
                every: 60 * 1000,
            },
            removeOnComplete: true,
        });
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
                    await this.jobQueries.execInsertIntoReport(service_id);
                }
                await this.redis.lpush(key, 0);
                await this.redis.ltrim(key, 0, 44);
                this.io.emit(`service-update:${created_by}`, { service_id, status: 0 });
            }
        }
    }

    private async checkMaintenance() {
        // console.log("Checking for scheduled maintenance...");
        // const scheduledMaintenances = await this.jobQueries.execGetScheduledMaintenances();

        // for (const maintenance of scheduledMaintenances) {
        //     const { id, service_id, start_time, end_time } = maintenance;
        //     const now = new Date();

        //     if (now >= new Date(start_time) && now <= new Date(end_time)) {
        //         console.log(`Marking service ${service_id} as under maintenance.`);
        //         // await this.jobQueries.execSetServiceUnderMaintenance(service_id);
        //         this.io.emit(`maintenance-update:${service_id}`, { status: "under_maintenance" });
        //     } else if (now > new Date(end_time)) {
        //         console.log(`Marking service ${service_id} as active after maintenance.`);
        //         // await this.jobQueries.execSetServiceActive(service_id);
        //         this.io.emit(`maintenance-update:${service_id}`, { status: "active" });
        //     }
        // }
    }
}