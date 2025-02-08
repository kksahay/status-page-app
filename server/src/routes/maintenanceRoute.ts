import { Hono } from "hono";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { maintenanceController } from "../controllers/index.js";

const app = new Hono();

app.post("/create", authMiddleware.verifyJWT, (c) => maintenanceController.createMaintenance(c));
app.get("/list", authMiddleware.verifyJWT, (c) => maintenanceController.getMaintenance(c));
app.put("/update", authMiddleware.verifyJWT, (c) => maintenanceController.updateMaintenance(c));
app.delete("/delete/:maintenanceId", authMiddleware.verifyJWT, (c) => maintenanceController.deleteMaintenance(c));

export default app;