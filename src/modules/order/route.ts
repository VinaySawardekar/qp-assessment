import { isAdmin, isExist } from "../../middleware/checkAccess";
import { checkGroceryStock } from "../../middleware/checkStockAvailable";
import { getOrderList, createOrder } from "./controller";

const express = require("express");
const router = express.Router();

router.post("/", [checkGroceryStock], createOrder);
router.get("/", getOrderList);

export default router;
