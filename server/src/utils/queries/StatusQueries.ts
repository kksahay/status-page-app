import { sql } from "../../server.js";

export class StatusQueries {
    async execGetStatus(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT 
                service_id, title, status
            FROM
                public.tblService
            WHERE
                created_by = ${userId}
        `;

        return response;
    }
}