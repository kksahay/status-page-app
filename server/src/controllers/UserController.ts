import bcrypt from 'bcryptjs';
import { UserQueries } from './../utils/queries/UserQueries.js';
import type { Context } from "hono";
import { BaseController } from "./BaseController.js";
import { User } from '../utils/types/index.js';
import { sign } from 'hono/jwt';

export class UserController extends BaseController {
    private readonly userQueries: UserQueries;

    constructor() {
        super();
        this.userQueries = new UserQueries();
    }

    async register(c: Context) {
        try {
            const user: User = new User(await c.req.json());
            const existingUser = await this.userQueries.checkUser(user);
            if (existingUser.length > 0) {
                return c.json({ message: "User already exists" }, 400);
            }
            const hashedPassword = await bcrypt.hash(user.pwd, 5);
            user.hashed_pwd = hashedPassword;
            await this.userQueries.execRegister(user);
            return c.json({ message: "User registered successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async login(c: Context) {
        try {
            const user: User = new User(await c.req.json());
            const existingUser = await this.userQueries.checkUser(user);

            if (existingUser.length < 1) {
                return c.json({ message: "User does not exists" }, 400);
            }
            const accountInfo = (await this.userQueries.execLogin(user))[0];
            const accountInfoValue = this.getValues(accountInfo);
            const passwordMatch = await bcrypt.compare(user.pwd, accountInfoValue[0]);
            if (!passwordMatch) {
                return c.json({ message: "Incorrect Password" }, 400);
            }
            const token = await sign(
                {
                    tokenId: Math.random().toString(36).substring(7),
                    userId: accountInfoValue[1],
                    role: accountInfoValue[2],
                    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
                },
                process.env.JWT_SECRET as string
            );
            return c.json({ message: "User Authenticated successfully", role: accountInfoValue[2], token }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async userDetails(c: Context) {
        try {
            const user = c.get("user");
            const result: unknown = (await this.userQueries.execUserDetails(user.userId))[0];
            const values: string[] = this.getValues(result);
            return c.json({ userId: values[0], name: values[1], email: values[2] }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async deleteTeam(c: Context) {
        try {
            const user = c.get("user");
            const userId = c.req.param("userId");
            if (user.role !== "admin") {
                return c.json({ message: "Unauthorized to perform action" }, 400);
            }
            await this.userQueries.execDeleteTeam(parseInt(userId));
            return c.json({ message: "User deleted successfully" }, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }

    async teamList(c: Context) {
        try {
            const user = c.get("user");
            if (user.role !== "admin") {
                return c.json({ message: "Unauthorized to perform action" }, 400);
            }
            const teamList = this.getValues(await this.userQueries.execTeamList());
            return c.json(teamList, 200);
        } catch (error: any) {
            return c.json(error, 400);
        }
    }
}