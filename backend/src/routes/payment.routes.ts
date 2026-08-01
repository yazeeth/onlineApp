import { Router } from "express";
import { getMyPayment, getAllPaymentsAdmin, changePaymentStatus } from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/payments/{orderId}:
 *   get:
 *     summary: Get payment details for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
router.get(
    "/:orderId",
    authMiddleware,
    getMyPayment
);

/**
 * @swagger
 * /api/payments/admin/all:
 *   get:
 *     summary: Get all payments for admin
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/admin/all",
    authMiddleware,
    requireAdmin,
    getAllPaymentsAdmin
);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags: [Payments]
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
 *         description: Payment status updated successfully
 *       400:
 *         description: Invalid payment status
 */
router.put(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    changePaymentStatus
);

export default router;