import { Router } from "express";

import {
    addProduct,
    getAllProducts,
    getSingleProduct,
    editProduct,
    removeProduct
} from "../controllers/product.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";


const router = Router();



// Admin only - create product
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               description:
 *                 type: string
 *                 example: Latest Apple smartphone
 *               price:
 *                 type: number
 *                 example: 350000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    authMiddleware,
    requireAdmin,
    addProduct
);



// Public - get products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: iPhone 15
 *                 price: 350000
 *                 stock: 10
 *                 categoryId: 1
 */
router.get(
    "/",
    getAllProducts
);



/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get(
    "/:id",
    getSingleProduct
);



// Admin only - update product
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin)
 *     tags: [Products]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Laptop
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 example: 250000
 *               stock:
 *                 type: integer
 *                 example: 5
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product data
 */
router.put(
    "/:id",
    authMiddleware,
    requireAdmin,
    editProduct
);



// Admin only - delete product
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
    "/:id",
    authMiddleware,
    requireAdmin,
    removeProduct
);



export default router;