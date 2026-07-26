import prisma from "../config/database";

export const createOrder = async (
    userId: number
) => {

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

    // Calculate total
    let totalAmount = 0;

    for (const item of cart.items) {

        totalAmount += item.product.price * item.quantity;

    }

    // Create order
    const order = await prisma.order.create({
        data: {
            userId,
            totalAmount,
            status: "PENDING",
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

    // Clear cart after checkout

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id
        }
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
    status: any
) => {

    const order = await prisma.order.update({
        where: {
            id: orderId
        },

        data: {
            status
        }
    });


    return order;

};