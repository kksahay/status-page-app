export class Maintenance {
    maintenance_id!: number;
    service_id!: number;
    title!: string;
    status!: string;
    start_time!: string;
    end_time!: string;
    created_by!: number;

    constructor(data?: Partial<Maintenance>) {
        Object.assign(this, data);
    }
}