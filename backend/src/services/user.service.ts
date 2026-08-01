import prisma from "../config/database";
import bcrypt from "bcrypt";


export const createUser = async (
    name: string,
    email: string,
    phone: string,
    password: string
) => {


    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (existingUser) {
        throw new Error("Email already registered");
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword
        }
    });

    await prisma.cart.create({
        data: {
            userId: user.id
        }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const updateUserRole = async (
    userId: number,
    role: "ADMIN" | "CUSTOMER"
) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            role
        }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
};

export const getAllUsers = async () => {

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true
        }
    });

    return users;
};