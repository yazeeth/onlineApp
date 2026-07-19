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
router.post(
    "/",
    authMiddleware,
    requireAdmin,
    addProduct
);



// Public - get products
router.get(
    "/",
    getAllProducts
);



router.get(
    "/:id",
    getSingleProduct
);



// Admin only - update product
router.put(
    "/:id",
    authMiddleware,
    requireAdmin,
    editProduct
);



// Admin only - delete product
router.delete(
    "/:id",
    authMiddleware,
    requireAdmin,
    removeProduct
);



export default router;