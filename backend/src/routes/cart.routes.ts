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
 *     responses:
 *       201:
 *         description: Item added to cart
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
 *     responses:
 *       200:
 *         description: Cart item updated
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
 *         description: Cart item removed
 */
router.delete(
    "/item/:id",
    authMiddleware,
    deleteCartItem
);



export default router;