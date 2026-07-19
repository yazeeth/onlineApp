import prisma from "../config/database";


export const createProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    categoryId: number
) => {

    const product = await prisma.product.create({

        data: {
            name,
            description,
            price,
            stock,
            image,
            categoryId
        }

    });


    return product;

};





export const getProducts = async () => {

    return await prisma.product.findMany({

        include: {
            category: true
        }

    });

};





export const getProductById = async (
    id: number
) => {

    const product = await prisma.product.findUnique({

        where: {
            id
        },

        include: {
            category: true
        }

    });



    if (!product) {

        throw new Error(
            "Product not found"
        );

    }



    return product;

};






export const updateProduct = async (

    id: number,

    data: {

        name?: string;

        description?: string;

        price?: number;

        stock?: number;

        image?: string;

        categoryId?: number;

    }

) => {



    const product = await prisma.product.findUnique({

        where:{
            id
        }

    });




    if(!product){

        throw new Error(
            "Product not found"
        );

    }





    return await prisma.product.update({

        where:{
            id
        },

        data

    });


};







export const deleteProduct = async (

    id:number

) => {



    const product = await prisma.product.findUnique({

        where:{
            id
        }

    });




    if(!product){

        throw new Error(
            "Product not found"
        );

    }





    await prisma.product.delete({

        where:{
            id
        }

    });




    return {

        message:"Product deleted successfully"

    };


};