import { sql } from "../../server.js";
import { Maintenance } from "../types/Maintenance.js";

export class MaintenanceQueries {
    async execCreateMaintenance(maintenance: Maintenance) {
        await sql`
            INSERT INTO
                public.tblMaintenance (service_id, start_time, end_time, status)
            VALUES
                (${maintenance.service_id}, ${maintenance.start_time}, ${maintenance.end_time}, ${maintenance.status})
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

    async execUpdateMaintenance(maintenance: Maintenance) {
        await sql`
            UPDATE
                public.tblMaintenance
            SET
                status = ${maintenance.status}
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
}