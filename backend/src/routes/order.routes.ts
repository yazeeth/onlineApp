import { Router } from "express";
import { checkout, getOrders, getSingleOrder, getAllOrdersAdmin, changeOrderStatus } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.post(
    "/checkout",
    authMiddleware,
    checkout
);

router.get(
    "/my-orders",
    authMiddleware,
    getOrders
);

router.get(
    "/admin/all",
    authMiddleware,
    requireAdmin,
    getAllOrdersAdmin
);

router.put(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    changeOrderStatus
);

router.get(
    "/:id",
    authMiddleware,
    getSingleOrder
);

export default router;