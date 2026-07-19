import prisma from "../config/database";


// Add product to cart
export const addToCart = async (
    userId: number,
    productId: number,
    quantity: number
) => {

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    });


    if (!cart) {

        cart = await prisma.cart.create({
            data: {
                userId
            }
        });

    }



    // Check if product already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId
        }
    });



    if (existingItem) {

        return await prisma.cartItem.update({

            where: {
                id: existingItem.id
            },

            data: {
                quantity: existingItem.quantity + quantity
            }

        });

    }



    return await prisma.cartItem.create({

        data: {

            cartId: cart.id,

            productId,

            quantity

        }

    });

};





// Get user's cart
export const getCart = async (
    userId: number
) => {


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



    if (!cart) {

        throw new Error(
            "Cart not found"
        );

    }



    return cart;

};






// Update cart item quantity
export const updateCartItem = async (

    userId: number,

    itemId: number,

    quantity: number

) => {



    const cart = await prisma.cart.findUnique({

        where: {
            userId
        }

    });



    if (!cart) {

        throw new Error(
            "Cart not found"
        );

    }



    return await prisma.cartItem.update({

        where: {

            id: itemId

        },

        data: {

            quantity

        }

    });


};






// Remove item from cart
export const removeCartItem = async (

    userId: number,

    itemId: number

) => {



    const cart = await prisma.cart.findUnique({

        where: {
            userId
        }

    });



    if (!cart) {

        throw new Error(
            "Cart not found"
        );

    }



    await prisma.cartItem.delete({

        where: {

            id: itemId

        }

    });



    return {

        message: "Item removed from cart"

    };

};