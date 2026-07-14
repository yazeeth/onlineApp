import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const loginUser = async (
    email: string,
    password: string
) => {

    // Find user by email
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (!user) {
        throw new Error("Invalid email or password");
    }


    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }


    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h"
        }
    );


    return {
        token
    };
};