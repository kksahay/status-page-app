export class User {
    user_id!: string;
    role!: number;
    name!: string;
    email!: string;
    pwd!: string;
    hashed_pwd!: string;
    created_at!: string;

    constructor(data?: Partial<User>) {
        Object.assign(this, data);
    }
}