import { Router } from "express";
import { registerUser, getProfile, updateUserRoleController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/register", registerUser);

router.get("/profile", authMiddleware, getProfile);

router.patch("/:id/role", authMiddleware, adminMiddleware, updateUserRoleController);

export default router;