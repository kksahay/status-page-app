import { sql } from "../../server.js";
import type { Service, ServiceReport } from "../types/Service.js";


export class ServiceQueries {
    async execCreateService(service: Service) {
        await sql`
            INSERT INTO 
                public.tblService (created_by, status, title, endpoint)
            VALUES
                (${service.created_by}, ${"Operational"}, ${service.title}, ${service.endpoint})
        `;
    }

    async execUpdateService(serviceReport: ServiceReport) {
        await sql`
            INSERT INTO 
                public.tblServiceReport (service_id, title, description, change_status)
            VALUES
                (${serviceReport.service_id}, ${serviceReport.title}, ${serviceReport.description}, ${serviceReport.change_status})
        `;
    }

    async execDeleteService(serviceId: number) {
        await sql`
            DELETE FROM
                public.tblService
            WHERE service_id = ${serviceId}
        `;
    }

    async execListOfServices(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT 
                service_id, status, title, endpoint
            FROM
                public.tblService
            WHERE
                created_by = ${userId}
        `;
        return response;
    }

    async execGetListOfServiceId(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT
                title, service_id
            FROM
                public.tblService
            WHERE
                created_by = ${userId}
        `;
        return response;
    }

    async execGetServiceHistory(serviceId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT
                title, description, change_status, created_at
            FROM
                public.tblServiceReport
            WHERE
                service_id = ${serviceId}
        `;
        return response;
    }
}