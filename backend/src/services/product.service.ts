import prisma from "../config/database";
import { getCategoryById } from "./category.service";


export const createProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    categoryId: number
) => {

    if (price < 0 || stock < 0) {
        throw new Error("Price and stock cannot be negative");
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        throw new Error("Category not found");
    }

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





export const getProducts = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    categoryId?: number
) => {

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
        skip,
        take: limit,
        where: {
            AND: [
                search
                    ? {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                    : {},
                categoryId
                    ? {
                        categoryId
                    }
                    : {}
            ]
        },
        include: {
            category: true
        }
    });

    const total = await prisma.product.count({
        where: {
            AND: [
                search
                    ? {
                        name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                    : {},
                categoryId
                    ? {
                        categoryId
                    }
                    : {}
            ]
        }
    });

    return {
        products,
        total,
        page,
        limit
    };
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

    if (data.price !== undefined && data.price < 0) {
        throw new Error("Price cannot be negative");
    }

    if (data.stock !== undefined && data.stock < 0) {
        throw new Error("Stock cannot be negative");
    }

    if (data.categoryId !== undefined) {
        const category = await getCategoryById(data.categoryId);

        if (!category) {
            throw new Error("Category not found");
        }
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