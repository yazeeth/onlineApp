import { Router } from "express";
import { registerUser, getProfile, updateUserRoleController, getAllUsersController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.post("/register", registerUser);
router.get("/profile", authMiddleware, getProfile);
router.get("/", authMiddleware, requireAdmin, getAllUsersController);
router.patch("/:id/role", authMiddleware, requireAdmin, updateUserRoleController);

export default router;