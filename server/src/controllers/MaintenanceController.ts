import type { Context } from "hono";
import { MaintenanceQueries } from "../utils/queries/MaintenanceQueries.js";
import { BaseController } from "./BaseController.js";
import { Maintenance } from "../utils/types/Maintenance.js";

export class MaintenanceController extends BaseController {
    private readonly maintenanceQueries: MaintenanceQueries;

    constructor() {
        super();
        this.maintenanceQueries = new MaintenanceQueries();
    }

    async createMaintenance(c: Context) {
        try {
            const user = c.get("user");
            const maintenance = new Maintenance(await c.req.json());
            maintenance.created_by = user.userId;
            await this.maintenanceQueries.execCreateMaintenance(maintenance);
            await this.maintenanceQueries.execCreateServiceReport(maintenance.service_id);
            return c.json({ message: "Maintenance created successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async getMaintenance(c: Context) {
        try {
            const user = c.get("user");
            const maintenanceList = await this.maintenanceQueries.execGetMaintenance(user.userId) as Maintenance[];
            return c.json(maintenanceList, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async updateMaintenance(c: Context) {
        try {
            const maintenance = new Maintenance(await c.req.json());
            await this.maintenanceQueries.execUpdateMaintenance(maintenance.service_id);
            await this.maintenanceQueries.execUpdateService(maintenance.service_id);
            await this.maintenanceQueries.execUpdateServiceReport(maintenance.service_id);
            return c.json({ message: "Maintenance updated successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async deleteMaintenance(c: Context) {
        try {
            const maintenanceId = c.req.param("maintenanceId");
            await this.maintenanceQueries.execDeleteMaintenance(parseInt(maintenanceId));
            return c.json({ message: "Maintenance deleted successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

}