import prisma from "../config/database";


// Add product to cart
export const addToCart = async (
    userId: number,
    productId: number,
    quantity: number
) => {

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    if (quantity > product.stock) {
        throw new Error("Insufficient stock");
    }

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

        if (existingItem.quantity + quantity > product.stock) {
            throw new Error("Insufficient stock");
        }

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



    const total = cart.items.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    return {
        ...cart,
        total
    };

};






// Update cart item quantity
export const updateCartItem = async (

    userId: number,

    itemId: number,

    quantity: number

) => {


    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

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

    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id
        }
    });

    if (!item) {
        throw new Error("Cart item not found");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: item.productId
        }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    if (quantity > product.stock) {
        throw new Error("Insufficient stock");
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

    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id
        }
    });

    if (!item) {
        throw new Error("Cart item not found");
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