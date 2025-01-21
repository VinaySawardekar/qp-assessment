import { isAdmin, isExist } from "../../middleware/checkAccess";
import {
  getGroceryList,
  createGroceryProduct,
  deleteGroceryProduct,
  updateGroceryProduct,
  fetchGroceryProductById,
  updateGroceryInventory,
} from "./controller";

const express = require("express");
const router = express.Router();

router.post("/", [isAdmin], createGroceryProduct);
router.get("/:id", [isExist], fetchGroceryProductById);
router.get("/", getGroceryList);

// Passed User Id in param as no JWT authentication is
// implemented for easy access
router.delete("/:id/:user_id", [isAdmin, isExist], deleteGroceryProduct);
router.patch("/:id", [isAdmin, isExist], updateGroceryProduct);
router.put("/inventory/:id", [isAdmin, isExist], updateGroceryInventory);

export default router;
