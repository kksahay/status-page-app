
import { MaintenanceController } from "./MaintenanceController.js";
import { ServiceController } from "./ServiceController.js";
import { UserController } from "./UserController.js";

const serviceController = new ServiceController();
const userController = new UserController();
const maintenanceController = new MaintenanceController();

export {
    serviceController,
    userController,
    maintenanceController
}