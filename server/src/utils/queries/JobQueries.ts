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
                (${serviceId}, ${'Outage'}, ${'Error in API response'}, ${'Major Ourage'})
        `
    }
}
