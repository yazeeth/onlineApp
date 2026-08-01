import { Request, Response } from "express";
import { getPaymentByOrderId, getAllPayments, updatePaymentStatus } from "../services/payment.service";
import { PaymentStatus } from "@prisma/client";

export const getMyPayment = async (
    req: Request,
    res: Response
) => {
    try {
        const user = req.user as {
            userId: number;
        };

        const orderId = Number(req.params.orderId);

        const payment = await getPaymentByOrderId(
            orderId,
            user.userId
        );

        res.json(payment);

    } catch (error: any) {
        res.status(404).json({
            message: error.message
        });
    }
};

export const getAllPaymentsAdmin = async (
    req: Request,
    res: Response
) => {
    try {
        const payments = await getAllPayments();

        res.json(payments);

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};

export const changePaymentStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const paymentId = Number(req.params.id);

        const { status } = req.body;

        const payment = await updatePaymentStatus(
            paymentId,
            status as PaymentStatus
        );

        res.json({
            message: "Payment status updated successfully",
            payment
        });

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};