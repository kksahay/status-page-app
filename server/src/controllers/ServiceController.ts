import type { Context } from "hono";
import { BaseController } from "./BaseController.js";
import { ServiceQueries } from "../utils/queries/ServiceQueries.js";
import { Service, ServiceReport, ServiceHistory } from "../utils/types/Service.js";

export class ServiceController extends BaseController {
    private serviceQueries: ServiceQueries;
    constructor() {
        super();
        this.serviceQueries = new ServiceQueries();
    }

    async createService(c: Context) {
        try {
            const user = c.get("user");
            const service = new Service(await c.req.json());
            service.created_by = user.userId;
            await this.serviceQueries.execCreateService(service);
            return c.json({ message: "Service created successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async updateService(c: Context) {
        try {
            const serviceReport = new ServiceReport(await c.req.json());
            await this.serviceQueries.execUpdateService(serviceReport);
            return c.json({ message: "Service updated successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async deleteService(c: Context) {
        try {
            const serviceId = c.req.param("serviceId");
            await this.serviceQueries.execDeleteService(parseInt(serviceId));
            return c.json({ message: "Service deleted successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async listOfServices(c: Context) {
        try {
            const user = c.get("user");
            const services = await this.serviceQueries.execListOfServices(user.userId) as Service[];
            return c.json(services, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async listOfUpdatesByService(c: Context) {
        try {
            const userId = c.req.param("userId");

            // Get list of service IDs
            const services = await this.serviceQueries.execGetListOfServiceId(parseInt(userId));
            const serviceIds = this.getValues(services);

            const serviceLogs: ServiceHistory[] = [];

            // Fetch history for each service ID in parallel
            await Promise.all(
                serviceIds.map(async (serviceId) => {
                    const serviceHistory = await this.serviceQueries.execGetServiceHistory(parseInt(serviceId)) as ServiceReport[];
                    serviceLogs.push(new ServiceHistory(parseInt(serviceId), serviceHistory));
                })
            );

            return c.json(serviceLogs, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }
}