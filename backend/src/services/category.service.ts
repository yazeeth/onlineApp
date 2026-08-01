import prisma from "../config/database";


export const createCategory = async (
    name: string
) => {

    const category = await prisma.category.create({
        data: {
            name
        }
    });


    return category;

};



export const getCategories = async () => {

    return await prisma.category.findMany({
        include: {
            products: true
        }
    });

};

export const getCategoryById = async (
    id: number
) => {

    const category = await prisma.category.findUnique({
        where: {
            id
        }
    });

    return category;

};