import { Router } from "express";

import {
    addCategory,
    getAllCategories
} from "../controllers/category.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";


const router = Router();


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authMiddleware,
    requireAdmin,
    addCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getAllCategories);


export default router;