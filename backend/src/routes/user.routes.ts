import { Router } from "express";
import {
    registerUser,
    getProfile,
    updateProfile,
    changePassword,
    updateUserRoleController,
    getAllUsersController,
    updateUserController,
    deleteUserController
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists or invalid data
 */
router.post("/register", registerUser);
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: John Doe
 *               email: john@example.com
 *               role: CUSTOMER
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, getProfile);
/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: +94771234567
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid profile data or email already exists
 *       401:
 *         description: Unauthorized
 */
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/password", authMiddleware, changePassword);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: John Doe
 *                 email: john@example.com
 *                 role: CUSTOMER
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/", authMiddleware, requireAdmin, getAllUsersController);

router.patch("/:id", authMiddleware, requireAdmin, updateUserController);
router.delete("/:id", authMiddleware, requireAdmin, deleteUserController);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - CUSTOMER
 *                   - ADMIN
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Admin access required
 */
router.patch("/:id/role", authMiddleware, requireAdmin, updateUserRoleController);

export default router;