import { Request, Response } from "express";

import {
    createCategory,
    getCategories
} from "../services/category.service";



export const addCategory = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name
        } = req.body;


        const category = await createCategory(
            name
        );


        res.status(201).json({
            message: "Category created successfully",
            category
        });


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};

export const getAllCategories = async (
    req: Request,
    res: Response
) => {

    try {

        const categories = await getCategories();


        res.json(categories);


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};