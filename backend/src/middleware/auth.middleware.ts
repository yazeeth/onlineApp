import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }


        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];


        if (!process.env.JWT_ACCESS_SECRET) {
            throw new Error("JWT secret missing");
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );


        req.user = decoded as {
            userId: number;
            email: string;
            role: string;
        };


        next();


    } catch(error) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }

};