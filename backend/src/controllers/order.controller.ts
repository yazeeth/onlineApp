import { Request, Response } from "express";
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus, cancelPendingOrder } from "../services/order.service";

export const checkout = async (
    req: Request,
    res: Response
) => {

    try {

        const user = req.user as {
            userId: number;
        };


        const { addressId, paymentMethod } = req.body;

        const order = await createOrder(
            user.userId,
            addressId,
            paymentMethod
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

export const getOrders = async (
    req: Request,
    res: Response
) => {

    try {

        const user = req.user as {
            userId: number;
        };


        const orders = await getUserOrders(
            user.userId
        );


        res.json(orders);


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};

export const getSingleOrder = async (
    req: Request,
    res: Response
) => {

    try {

        const user = req.user as {
            userId: number;
        };


        const orderId = Number(req.params.id);


        const order = await getOrderById(
            orderId,
            user.userId
        );


        res.json(order);


    } catch(error:any){

        res.status(404).json({
            message: error.message
        });

    }

};

export const getAllOrdersAdmin = async (
    req: Request,
    res: Response
) => {

    try {

        const orders = await getAllOrders();


        res.json(orders);


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};

export const changeOrderStatus = async (
    req: Request,
    res: Response
) => {

    try {

        const orderId = Number(req.params.id);

        const { status } = req.body;


        const order = await updateOrderStatus(
            orderId,
            status
        );


        res.json({
            message: "Order status updated successfully",
            order
        });


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};

export const cancelOrder = async (
    req: Request,
    res: Response
) => {

    try {

        const user = req.user as {
            userId: number;
        };

        const orderId = Number(req.params.id);

        const order = await cancelPendingOrder(
            orderId,
            user.userId
        );

        res.json({
            message: "Order cancelled successfully",
            order
        });

    } catch(error:any){

        const message = error.message;

        if (message === "Order not found") {
            res.status(404).json({ message });
            return;
        }

        if (message === "Order does not belong to the authenticated user") {
            res.status(403).json({ message });
            return;
        }

        res.status(400).json({
            message
        });

    }

};