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
}