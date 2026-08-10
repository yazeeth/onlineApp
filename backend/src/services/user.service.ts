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

export const changeUserPassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string
) => {
    if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
    }

    if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters long");
    }

    if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!passwordMatches) {
        throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    });
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