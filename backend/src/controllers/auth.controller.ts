import { Request, Response } from "express";
import {
    loginUser,
    refreshAccessToken,
    logoutUser
} from "../services/auth.service";


export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            email,
            password
        } = req.body;


        const result = await loginUser(
            email,
            password
        );


        res.json({
            message: "Login successful",
            ...result
        });


    } catch(error:any){

        res.status(401).json({
            message: error.message
        });

    }

};

export const refresh = async (
    req: Request,
    res: Response
) => {

    try {

        const { refreshToken } = req.body;

        const result = await refreshAccessToken(
            refreshToken
        );

        res.json({
            message: "Access token refreshed",
            ...result
        });

    } catch (error: any) {

        res.status(401).json({
            message: error.message
        });

    }

};

export const logout = async (
    req: Request,
    res: Response
) => {

    try {

        const { refreshToken } = req.body;


        const result = await logoutUser(
            refreshToken
        );


        res.json(result);


    } catch(error:any){

        res.status(400).json({
            message: error.message
        });

    }

};