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

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};