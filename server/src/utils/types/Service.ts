export class Service {
    service_id!: number;
    created_by!: number;
    title!: string;
    status!: string;
    endpoint!: string;
    created_at!: string;

    constructor(data?: Partial<Service>) {
        Object.assign(this, data);
    }
}

export class ServiceReport {
    service_id!: number;
    title!: string;
    description!: string;
    created_at!: string;
    change_status!: string;

    constructor(data?: Partial<ServiceReport>) {
        Object.assign(this, data);
    }
}

export class ServiceHistory {
    service_id!: number;
    history!: ServiceReport[];

    constructor(service_id: number, history: ServiceReport[]) {
        this.service_id = service_id;
        this.history = history;
    }
}

export class ServiceWorker {
    userId!: number;
    service!: Service[];
}