import { Router } from "express";

import {
    addCategory,
    getAllCategories
} from "../controllers/category.controller";


const router = Router();


router.post("/", addCategory);

router.get("/", getAllCategories);


export default router;