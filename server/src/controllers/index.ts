
import { MaintenanceController } from "./MaintenanceController.js";
import { ServiceController } from "./ServiceController.js";
import { StatusController } from "./StatusController.js";
import { UserController } from "./UserController.js";

const serviceController = new ServiceController();
const userController = new UserController();
const maintenanceController = new MaintenanceController();
const statusController = new StatusController();

export {
    serviceController,
    userController,
    maintenanceController,
    statusController
}