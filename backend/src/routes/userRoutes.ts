import { Router } from "express";
import { syncClerkUser } from "../controllers/userController.js";

const router = Router();

router.post("/sync", syncClerkUser);

export default router;
