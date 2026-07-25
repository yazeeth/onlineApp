import { Request, Response } from "express";
import { createOrder } from "../services/order.service";


export const checkout = async (
    req: Request,
    res: Response
) => {

    try {

        const user = req.user as {
            userId: number;
        };


        const order = await createOrder(
            user.userId
        );


        res.status(201).json({
            message: "Order created successfully",
            order
        });


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};