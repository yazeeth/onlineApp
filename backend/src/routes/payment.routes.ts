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
 *         example: 1
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               orderId: 1
 *               amount: 50000
 *               method: COD
 *               status: PENDING
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
 *     summary: Get all payments (Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 orderId: 1
 *                 amount: 50000
 *                 method: BANK_TRANSFER
 *                 status: PAID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
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
 *     summary: Update payment status (Admin)
 *     tags: [Payments]
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
 *                   - PAID
 *                   - FAILED
 *                 example: PAID
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