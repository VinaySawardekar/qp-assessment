const express = require("express");
const router = express.Router();
import { healthCheck, init } from "../controllers/healthCheckController";
import userRoutes from "../modules/user/route";
import groceryRoutes from "../modules/grocery/route";
import orderRoutes from "../modules/order/route";

router.get("/", init);
router.get("/health-check", healthCheck);
router.use("/users", userRoutes);
router.use("/grocery", groceryRoutes);
router.use("/order", orderRoutes);

export default router;
