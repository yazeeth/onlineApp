import { Router } from "express";
import { getMyPayment, getAllPaymentsAdmin, changePaymentStatus } from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get(
    "/:orderId",
    authMiddleware,
    getMyPayment
);

router.get(
    "/admin/all",
    authMiddleware,
    requireAdmin,
    getAllPaymentsAdmin
);

router.put(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    changePaymentStatus
);

export default router;