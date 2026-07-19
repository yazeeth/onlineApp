import { Request, Response } from "express";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../services/cart.service";



// Add product to cart
export const addCartItem = async (
    req: Request,
    res: Response
) => {

    try {

        const userId = Number((req.user as any).userId);


        const {
            productId,
            quantity
        } = req.body;



        const item = await addToCart(
            userId,
            productId,
            quantity
        );


        res.status(201).json({

            message:"Product added to cart",

            item

        });


    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};






// Get cart
export const getUserCart = async (
    req: Request,
    res: Response
) => {

    try {


        const userId = Number((req.user as any).userId);


        const cart = await getCart(userId);


        res.json(cart);



    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};








// Update cart item
export const editCartItem = async (
    req: Request,
    res: Response
) => {

    try {


        const userId = Number((req.user as any).userId);


        const itemId = Number(req.params.id);


        const {
            quantity
        } = req.body;



        const item = await updateCartItem(

            userId,

            itemId,

            quantity

        );



        res.json({

            message:"Cart updated",

            item

        });



    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};









// Remove cart item
export const deleteCartItem = async (
    req: Request,
    res: Response
) => {

    try {


        const userId = Number((req.user as any).userId);


        const itemId = Number(req.params.id);



        const result = await removeCartItem(

            userId,

            itemId

        );



        res.json(result);



    } catch(error:any){

        res.status(400).json({

            message:error.message

        });

    }

};