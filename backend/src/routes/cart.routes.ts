import { Router } from "express";

import {
    addCartItem,
    getUserCart,
    editCartItem,
    deleteCartItem
} from "../controllers/cart.controller";

import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();



/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Invalid product or quantity
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/add",
    authMiddleware,
    addCartItem
);



/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart details
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               items:
 *                 - productId: 1
 *                   quantity: 2
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    authMiddleware,
    getUserCart
);



/**
 * @swagger
 * /api/cart/item/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Invalid quantity
 */
router.put(
    "/item/:id",
    authMiddleware,
    editCartItem
);



/**
 * @swagger
 * /api/cart/item/{id}:
 *   delete:
 *     summary: Remove cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       404:
 *         description: Cart item not found
 */
router.delete(
    "/item/:id",
    authMiddleware,
    deleteCartItem
);



export default router;