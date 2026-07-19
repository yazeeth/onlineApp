import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";



const generateAccessToken = (
    userId: number,
    email: string,
    role: string
) => {

    return jwt.sign(
        {
            userId,
            email,
            role
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: "15m"
        }
    );

};



const generateRefreshToken = () => {

    return crypto
        .randomBytes(64)
        .toString("hex");

};




// LOGIN USER
export const loginUser = async (
    email: string,
    password: string
) => {


    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });



    if (!user) {
        throw new Error("Invalid email or password");
    }



    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );



    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }




    const accessToken = generateAccessToken(
        user.id,
        user.email,
        user.role
    );



    const refreshToken = generateRefreshToken();



    await prisma.refreshToken.create({

        data: {

            token: refreshToken,

            userId: user.id,

            expiresAt: new Date(
                Date.now() +
                30 * 24 * 60 * 60 * 1000
            )

        }

    });



    return {

        accessToken,

        refreshToken

    };

};






// REFRESH ACCESS TOKEN
export const refreshAccessToken = async (
    refreshToken: string
) => {



    const storedToken =
        await prisma.refreshToken.findUnique({

            where: {
                token: refreshToken
            },

            include: {
                user: true
            }

        });





    if (!storedToken) {

        throw new Error(
            "Invalid refresh token"
        );

    }





    if (storedToken.expiresAt < new Date()) {



        await prisma.refreshToken.delete({

            where:{
                token: refreshToken
            }

        });



        throw new Error(
            "Refresh token expired"
        );

    }






    // Delete old refresh token
    await prisma.refreshToken.delete({

        where:{
            token: refreshToken
        }

    });






    // Create new refresh token
    const newRefreshToken =
        generateRefreshToken();






    await prisma.refreshToken.create({

        data: {

            token:newRefreshToken,

            userId:storedToken.user.id,

            expiresAt:new Date(
                Date.now() +
                30 * 24 * 60 * 60 * 1000
            )

        }

    });







    const accessToken =
        generateAccessToken(

            storedToken.user.id,

            storedToken.user.email,

            storedToken.user.role

        );






    return {

        accessToken,

        refreshToken:newRefreshToken

    };


};







// LOGOUT USER
export const logoutUser = async (
    refreshToken:string
) => {



    const token =
        await prisma.refreshToken.findUnique({

            where:{
                token:refreshToken
            }

        });





    if(!token){

        throw new Error(
            "Refresh token not found"
        );

    }





    await prisma.refreshToken.delete({

        where:{
            token:refreshToken
        }

    });





    return {

        message:"Logout successful"

    };

};