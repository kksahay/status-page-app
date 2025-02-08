import { sql } from "../../server.js";
import { Maintenance } from "../types/Maintenance.js";

export class MaintenanceQueries {
    async execCreateMaintenance(maintenance: Maintenance) {
        await sql`
            INSERT INTO
                public.tblMaintenance (service_id, start_time, end_time, status, created_by)
            VALUES
                (${maintenance.service_id}, ${maintenance.start_time}, ${maintenance.end_time}, ${"Scheduled"}, ${maintenance.created_by})
        `
    }

    async execCreateServiceReport(serviceId: number) {
        await sql`
            INSERT INTO 
                public.tblServiceReport (service_id, title, change_status, description)
            VALUES
                (${serviceId}, ${"Maintenance"}, ${"Maintenance Scheduled"}, ${"Maintenance Scheduled"})
        `
    }

    async execUpdateService(serviceId: number) {
        await sql`
            UPDATE
                public.tblService
            SET
                status = ${"Operational"}
            WHERE
                service_id = ${serviceId}
        `
    }

    async execUpdateMaintenance(serviceId: number) {
        await sql`
            UPDATE
                public.tblMaintenance
            SET
                status = ${"Completed"}
            WHERE
                service_id = ${serviceId}
        `
    }

    async execUpdateServiceReport(serviceId: number) {
        await sql`
            INSERT INTO 
                public.tblServiceReport (service_id, title, change_status, description)
            VALUES
                (${serviceId}, ${"Maintenance"}, ${"Maintenance Completed"}, ${"Maintenance Completed"})
        `
    }

    async execDeleteMaintenance(maintenanceId: number) {
        await sql`
            DELETE FROM
                public.tblMaintenance
            WHERE
                maintenance_id = ${maintenanceId}
        `
    }

    async execGetMaintenance(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT
                tM.maintenance_id, tM.service_id, tS.title, tM.start_time, tM.end_time, tM.status
            FROM
                public.tblMaintenance tM
                INNER JOIN
                public.tblService tS
                ON
                tM.service_id = tS.service_id
            WHERE
                tM.created_by = ${userId}
        `
        return response;
    }
}