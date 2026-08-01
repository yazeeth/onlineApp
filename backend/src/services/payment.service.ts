import { OrderStatus, PaymentStatus } from "@prisma/client";
import prisma from "../config/database";

export const getPaymentByOrderId = async (
    orderId: number,
    userId: number
) => {
    const payment = await prisma.payment.findFirst({
        where: {
            orderId,
            order: {
                userId
            }
        }
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    return payment;
};

export const getAllPayments = async () => {
    return await prisma.payment.findMany({
        include: {
            order: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

export const updatePaymentStatus = async (
    paymentId: number,
    status: PaymentStatus
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId
        }
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    const updatedPayment = await prisma.$transaction(async (tx) => {
        const updated = await tx.payment.update({
            where: {
                id: paymentId
            },
            data: {
                status
            }
        });

        if (status === PaymentStatus.PAID) {
            await tx.order.update({
                where: {
                    id: payment.orderId
                },
                data: {
                    status: OrderStatus.CONFIRMED
                }
            });
        }

        return updated;
    });

    return updatedPayment;
};