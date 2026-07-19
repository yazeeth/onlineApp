import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const generateAccessToken = (
    userId: number,
    email: string
) => {

    return jwt.sign(
        {
            userId,
            email
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: "15m"
        }
    );

};


const generateRefreshToken = () => {

    return crypto.randomBytes(64).toString("hex");

};



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


    // Compare password
    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );


    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }


    // Generate short-lived access token
    const accessToken = generateAccessToken(
        user.id,
        user.email
    );


    // Generate long-lived refresh token
    const refreshToken = generateRefreshToken();


    // Save refresh token in database
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            )
        }
    });


    return {
        accessToken,
        refreshToken
    };

};

export const refreshAccessToken = async (
    refreshToken: string
) => {

    // Find refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        },
        include: {
            user: true
        }
    });


    if (!storedToken) {
        throw new Error("Invalid refresh token");
    }


    // Check expiry
    if (storedToken.expiresAt < new Date()) {

        await prisma.refreshToken.delete({
            where: {
                token: refreshToken
            }
        });

        throw new Error("Refresh token expired");
    }


    // Generate new access token
    const accessToken = generateAccessToken(
        storedToken.user.id,
        storedToken.user.email
    );


    return {
        accessToken
    };

};

export const logoutUser = async (
    refreshToken: string
) => {

    const token = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    });


    if (!token) {
        throw new Error("Refresh token not found");
    }


    await prisma.refreshToken.delete({
        where: {
            token: refreshToken
        }
    });


    return {
        message: "Logout successful"
    };

};