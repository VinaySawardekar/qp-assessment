import { isAdmin } from "../../middleware/checkAccess";
import { getAllUsers } from "./controller";

const express = require("express");
const router = express.Router();

router.get("/", getAllUsers);

export default router;
