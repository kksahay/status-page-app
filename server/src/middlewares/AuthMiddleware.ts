import type { Context, Next } from "hono";
import { verify, decode } from "hono/jwt";


export class AuthMiddleware {
    async verifyJWT(c: Context, next: Next) {
        try {
            const token = c.req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                throw new Error("Unauthorized request");
            }

            await verify(token, process.env.JWT_SECRET! || "StatusAppSecret");
            const decodedToken = decode(token);
            const { payload } = decodedToken;
            c.set("user", payload);
            await next();
        } catch (error: any) {
            return c.json(error.message || "Invalid token", 401);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
