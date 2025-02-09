import { Hono } from "hono";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const app = new Hono();

app.post("/register", (c) => userController.register(c));
app.post("/login", (c) => userController.login(c));
app.delete("/delete/:userId", authMiddleware.verifyJWT, (c) => userController.deleteTeam(c));
app.get("/teamList", authMiddleware.verifyJWT, (c) => userController.teamList(c));
app.get("/userDetails", authMiddleware.verifyJWT, (c) => userController.userDetails(c));

export default app;