import { sql } from "../../server.js";
import { Maintenance } from "../types/Maintenance.js";

export class MaintenanceQueries {
    async execCreateMaintenance(maintenance: Maintenance) {
        await sql`
            INSERT INTO
                public.tblMaintenance (service_id, start_time, end_time, status, created_by)
            VALUES
                (${maintenance.service_id}, ${maintenance.start_time}, ${maintenance.end_time}, ${"Ongoing"}, ${maintenance.created_by})
        `
    }

    async execCreateServiceReport(serviceId: number) {
        await sql`
            INSERT INTO 
                public.tblServiceReport (service_id, title, change_status)
            VALUES
                (${serviceId}, ${"Maintenance"}, ${"Under Maintenance"})
        `
    }

    async execUpdateService(serviceId: number, status: string) {
        await sql`
            UPDATE
                public.tblService
            SET
                status = ${"Operational"}
            WHERE
                service_id = ${serviceId}
        `
    }

    async execUpdateMaintenance(maintenance: Maintenance) {
        await sql`
            UPDATE
                public.tblMaintenance
            SET
                status = ${"Completed"}
            WHERE
                service_id = ${maintenance.service_id}
        `
    }

    async execDeleteMaintenance(serviceId: number) {
        await sql`
            DELETE FROM
                public.tblMaintenance
            WHERE
                service_id = ${serviceId}
        `
    }

    async execGetMaintenance(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT
                maintenance_id, service_id, start_time, end_time, status
            FROM
                public.tblMaintenance
            WHERE
                created_by = ${userId}
                
        `
        return response;
    }
}