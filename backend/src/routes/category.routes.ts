import { Router } from "express";

import {
    addCategory,
    getAllCategories
} from "../controllers/category.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";


const router = Router();


router.post(
    "/",
    authMiddleware,
    requireAdmin,
    addCategory
);

router.get("/", getAllCategories);


export default router;