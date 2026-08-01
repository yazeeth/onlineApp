import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import prisma from "../config/database";

const allowedOrderStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED
];

const orderStatusTransitions: Record<OrderStatus, OrderStatus[]> = {

    PENDING: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED
    ],

    CONFIRMED: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED
    ],

    PROCESSING: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED
    ],

    SHIPPED: [
        OrderStatus.DELIVERED
    ],

    DELIVERED: [],

    CANCELLED: []

};

export const createOrder = async (
    userId: number,
    paymentMethod: PaymentMethod
) => {

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        throw new Error("Invalid payment method");
    }

    // Find user's cart
    const cart = await prisma.cart.findUnique({
        where: {
            userId
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });


    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // Check stock availability
    for (const item of cart.items) {

        if (item.quantity > item.product.stock) {

            throw new Error(
                `${item.product.name} has only ${item.product.stock} item(s) in stock`
            );

        }

    }

    // Calculate total
    let totalAmount = 0;

    for (const item of cart.items) {

        totalAmount += item.product.price * item.quantity;

    }

    // Create order
    const order = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                status: OrderStatus.PENDING,
                items: {
                    create: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },

            include: {
                items: true
            }
        });

        await tx.payment.create({
            data: {
                orderId: order.id,
                amount: totalAmount,
                method: paymentMethod,
                status: PaymentStatus.PENDING
            }
        });

        // Reduce product stock
        for (const item of cart.items) {

            await tx.product.update({
                where: {
                    id: item.productId
                },

                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });

        }

        // Clear cart after checkout
        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });

        return order;

    });

    return order;

};

// Get logged-in user's orders
export const getUserOrders = async (
    userId: number
) => {

    const orders = await prisma.order.findMany({
        where: {
            userId
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return orders;

};

// NOTE: This function is for fetching ONE order by its orderId.
// Do NOT use this for the /my-orders endpoint. That endpoint must call getUserOrders().
export const getOrderById = async (
    orderId: number,
    userId: number
) => {

    const order = await prisma.order.findFirst({

        where: {
            id: orderId,
            userId
        },

        include: {
            items: {
                include: {
                    product: true
                }
            }
        }

    });


    if (!order) {
        throw new Error("Order not found");
    }


    return order;

};

export const getAllOrders = async () => {

    const orders = await prisma.order.findMany({

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },

            items: {
                include: {
                    product: true
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }

    });


    return orders;

};

export const updateOrderStatus = async (
    orderId: number,
    status: OrderStatus
) => {

    if (!allowedOrderStatuses.includes(status)) {
        throw new Error("Invalid order status");
    }


    const existingOrder = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    });


    if (!existingOrder) {
        throw new Error("Order not found");
    }

    const currentStatus = existingOrder.status;

    if (
        !orderStatusTransitions[currentStatus].includes(status)
    ) {
        throw new Error(
            `Cannot change order status from ${currentStatus} to ${status}`
        );
    }

    const order = await prisma.$transaction(async (tx) => {

        if (status === OrderStatus.CANCELLED) {

            const orderItems = await tx.orderItem.findMany({
                where: {
                    orderId
                }
            });

            for (const item of orderItems) {

                await tx.product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });

            }

        }

        return await tx.order.update({
            where: {
                id: orderId
            },
            data: {
                status
            }
        });

    });


    return order;

};
