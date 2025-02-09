import { sql } from "../../server.js";
import type { User } from "../types/User.js";

export class UserQueries {

    async checkUser(user: User): Promise<unknown[]> {
        const response = await sql`
            SELECT
                user_id
            FROM
                public.tblUser
            WHERE
                email = ${user.email}
        `
        return response;
    }

    async execRegister(user: User) {
        await sql`
            INSERT INTO 
                public.tblUser (role, name, email, hashed_pwd)
            VALUES
                (${'user'}, ${user.name}, ${user.email}, ${user.hashed_pwd})
        `
    }

    async execLogin(user: User): Promise<unknown[]> {
        const response = await sql`
            SELECT
                hashed_pwd, user_id, role
            FROM
                public.tblUser
            WHERE
                email = ${user.email}
        `;
        return response;
    }

    async execUserDetails(userId: number): Promise<unknown[]> {
        const response = await sql`
            SELECT
                user_id, name, email
            FROM
                public.tblUser
            WHERE
                user_id = ${userId}
        `;
        return response;
    }

    async execDeleteTeam(userId: number) {
        await sql`
            DELETE FROM
                public.tblUser
            WHERE
                user_id = ${userId}
        `
    }

    async execTeamList(): Promise<unknown[]> {
        const response = await sql`
            SELECT
                user_id, name, email
            FROM
                public.tblUser
            WHERE
                role <> 'admin'
        `;
        return response;
    }


}

