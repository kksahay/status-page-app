import { Hono } from "hono";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { serviceController } from "../controllers/index.js";


const app = new Hono();

app.post("/create", authMiddleware.verifyJWT, (c) => serviceController.createService(c));
app.put("/update", authMiddleware.verifyJWT, (c) => serviceController.updateService(c));
app.delete("/delete/:serviceId", authMiddleware.verifyJWT, (c) => serviceController.deleteService(c));
app.get("/servicesList", authMiddleware.verifyJWT, (c) => serviceController.listOfServices(c));
app.get("/servicesHistory/:userId", (c) => serviceController.listOfUpdatesByService(c));

export default app;