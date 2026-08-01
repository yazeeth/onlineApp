import { Router } from "express";
import { checkout, getOrders, getSingleOrder, getAllOrdersAdmin, changeOrderStatus } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Create order from current user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum:
 *                   - COD
 *                   - BANK_TRANSFER
 *                 example: COD
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order created successfully
 *               order:
 *                 id: 1
 *                 totalAmount: 300000
 *                 status: PENDING
 *       400:
 *         description: Cart is empty, invalid payment method, or checkout failed
 */
router.post(
    "/checkout",
    authMiddleware,
    checkout
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 totalAmount: 300000
 *                 status: CONFIRMED
 *                 items:
 *                   - productId: 1
 *                     quantity: 2
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/my-orders",
    authMiddleware,
    getOrders
);

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders with customer and item details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
    "/admin/all",
    authMiddleware,
    requireAdmin,
    getAllOrdersAdmin
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - CONFIRMED
 *                   - PROCESSING
 *                   - SHIPPED
 *                   - DELIVERED
 *                   - CANCELLED
 *                 example: PROCESSING
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status transition
 */
router.put(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    changeOrderStatus
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
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
 *         description: Order details including items
 *       404:
 *         description: Order not found
 */
router.get(
    "/:id",
    authMiddleware,
    getSingleOrder
);

export default router;