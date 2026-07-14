import { Router } from "express";
import { registerUser, getProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.get("/profile", authMiddleware, getProfile);

export default router;