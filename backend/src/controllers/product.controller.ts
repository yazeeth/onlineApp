import { Request, Response } from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../services/product.service";



// Create Product
export const addProduct = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name,
            description,
            price,
            stock,
            image,
            categoryId
        } = req.body;


        const product = await createProduct(
            name,
            description,
            price,
            stock,
            image,
            categoryId
        );


        res.status(201).json({
            message: "Product created successfully",
            product
        });


    } catch(error:any){

        res.status(400).json({
            message:error.message
        });

    }

};





// Get all products
export const getAllProducts = async (
    req: Request,
    res: Response
) => {

    try {

        const products = await getProducts();

        res.json(products);


    } catch(error:any){

        res.status(400).json({
            message:error.message
        });

    }

};






// Get single product
export const getSingleProduct = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);


        const product = await getProductById(id);


        res.json(product);


    } catch(error:any){

        res.status(404).json({
            message:error.message
        });

    }

};








// Update Product
export const editProduct = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);


        const product = await updateProduct(
            id,
            req.body
        );


        res.json({

            message:"Product updated successfully",

            product

        });



    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};








// Delete Product
export const removeProduct = async (
    req: Request,
    res: Response
) => {

    try {

        const id = Number(req.params.id);


        const result = await deleteProduct(id);


        res.json(result);



    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};