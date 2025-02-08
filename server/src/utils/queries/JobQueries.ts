import { sql } from "../../server.js";

export class JobQueries {
    async execGetAllServices(): Promise<unknown[]> {
        const response = await sql`
            SELECT 
                service_id, created_by, endpoint
            FROM
                public.tblService
            WHERE
                status = ${'Operational'};
        `
        return response;
    }

    async execDowngradeService(serviceId: number) {
        await sql`
            UPDATE 
                public.tblService
            SET
                status = ${'Major Outage'}
            WHERE
                service_id = ${serviceId}
        `
    }

    async execInsertIntoReport(serviceId: number) {
        await sql`
        INSERT INTO 
                public.tblServiceReport (service_id, title, description, change_status)
            VALUES
                (${serviceId}, ${'Outage'}, ${'Error in API response'}, ${'Major Outage'})
        `
    }

    async execGetScheduledMaintenances(): Promise<unknown[]> {
        const response = sql`
            SELECT 
                maintenance_id, 
                service_id, 
                start_time, 
                end_time,
                created_by
            FROM
                public.tblMaintenance
            WHERE
                CURRENT_TIMESTAMP >= start_time
            AND
                status = 'Scheduled'
        `
        return response;
    }

    async execGetCompletedMaintenances(): Promise<unknown[]> {
        const response = sql`
            SELECT 
                maintenance_id, 
                service_id, 
                start_time, 
                end_time,
                created_by
            FROM
                public.tblMaintenance
            WHERE
                end_time <= CURRENT_TIMESTAMP
            AND
                status = 'Ongoing'
        `
        return response;
    }

    async execSetServiceUnderMaintenance(maintenanceId: number, status: string) {
        await sql`
            UPDATE
                public.tblMaintenance
            SET
                status = ${status}
            WHERE
                maintenance_id = ${maintenanceId}
            
        `
    }

    async execCreateServiceReport(serviceId: number, status: string, description: string) {
        await sql`
            INSERT INTO 
                public.tblServiceReport (service_id, title, change_status, description)
            VALUES
                (${serviceId}, ${"Maintenance"}, ${status}, ${description})        `
    }

    async execUpdateService(serviceId: number, status: string) {
        await sql`
            UPDATE
                public.tblService
            SET
                status = ${status}
            WHERE
                service_id = ${serviceId}
        `
    }

}
