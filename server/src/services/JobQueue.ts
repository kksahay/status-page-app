
import { Queue, Worker } from "bullmq";
import type { Service } from "../utils/types/Service.js";
import { redisClient } from "../configs/RedisClient.js";
import type { Redis } from "ioredis";
import { JobQueries } from "../utils/queries/JobQueries.js";
import type { Server } from "socket.io";
import { SocketConnection } from "../configs/SocketConnection.js";
import type { Maintenance } from "../utils/types/Maintenance.js";

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
        this.serviceWorker = new Worker(
    "jobs-monitor",
    async (job) => {
        if (job.name === "endpoints-monitor") {
            await this.checkServices();
        }
    },
    { connection: this.redis }
);

this.maintenanceWorker = new Worker(
    "jobs-monitor",
    async (job) => {
        if (job.name === "maintenance-check") {
            await this.checkMaintenance();
        }
    },
    { connection: this.redis }
);
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
                    this.io.emit(`status-update:${created_by}`, { service_id, status: 1 });
                } else {
                    throw Error();
                }
            } catch (error) {
                const lastTwo = await this.redis.lrange(key, 0, 1);
                if (lastTwo.length === 2 && lastTwo[0] === "0" && lastTwo[1] === "0") {
                    await this.jobQueries.execDowngradeService(service_id);
                    await this.jobQueries.execInsertIntoReport(service_id);
                    this.io.emit(`service-update:${created_by}`, { service_id, title: "Outage", description: "Error in API Response", change_status: "Major Outage" });
                }
                await this.redis.lpush(key, 0);
                await this.redis.ltrim(key, 0, 44);
                this.io.emit(`status-update:${created_by}`, { service_id, status: 0 });
            }
        }
    }

    private async checkMaintenance() {
        const scheduledMaintenances = await this.jobQueries.execGetScheduledMaintenances() as Maintenance[];
        const completedMaintenances = await this.jobQueries.execGetCompletedMaintenances() as Maintenance[];
        for (const maintenance of scheduledMaintenances) {
            const { maintenance_id, service_id, created_by } = maintenance;
            await this.jobQueries.execSetServiceUnderMaintenance(maintenance_id, "Ongoing");
            await this.jobQueries.execUpdateService(service_id, "Maintenance");
            await this.jobQueries.execCreateServiceReport(service_id, "Maintenance Ongoing", "Maintenance Ongoing");
            this.io.emit(`maintenance-update:${created_by}`, { service_id, title: "Maintenance", description: "Maintenance Ongoing", change_status: "Maintenance Ongoing" });
        }
        for (const maintenance of completedMaintenances) {
            const { maintenance_id, service_id, created_by } = maintenance;
            await this.jobQueries.execSetServiceUnderMaintenance(maintenance_id, "Completed");
            await this.jobQueries.execUpdateService(service_id, "Operational");
            await this.jobQueries.execCreateServiceReport(service_id, "Maintenance Completed", "Maintenance Completed");
            this.io.emit(`maintenance-update:${created_by}`, { service_id, title: "Maintenance", description: "Maintenance Completed", change_status: "Operational" });
        }
    }
}