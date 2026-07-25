import { Router } from "express";

import {
    checkout
} from "../controllers/order.controller";

import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();


router.post(
    "/checkout",
    authMiddleware,
    checkout
);


export default router;