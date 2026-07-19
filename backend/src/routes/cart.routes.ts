import { Router } from "express";

import {
    addCartItem,
    getUserCart,
    editCartItem,
    deleteCartItem
} from "../controllers/cart.controller";

import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();



// Add product to cart
router.post(
    "/add",
    authMiddleware,
    addCartItem
);



// Get current user's cart
router.get(
    "/",
    authMiddleware,
    getUserCart
);



// Update cart item quantity
router.put(
    "/item/:id",
    authMiddleware,
    editCartItem
);



// Remove cart item
router.delete(
    "/item/:id",
    authMiddleware,
    deleteCartItem
);



export default router;