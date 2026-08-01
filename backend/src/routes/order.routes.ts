import { Router } from "express";
import { checkout, getOrders, getSingleOrder, getAllOrdersAdmin, changeOrderStatus } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Create order from cart checkout
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or checkout failed
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
 *     summary: Get all orders for admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders
 *       401:
 *         description: Unauthorized
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
 *     summary: Update order status
 *     tags: [Orders]
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
 *         description: Order status updated successfully
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
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get(
    "/:id",
    authMiddleware,
    getSingleOrder
);

export default router;