import { Request, Response } from "express";
import { createUser } from "../services/user.service";


export const registerUser = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        const user = await createUser(
            name,
            email,
            phone,
            password
        );


        res.status(201).json({
            message: "User created successfully",
            user
        });


    } catch (error) {

        res.status(500).json({
            message: "Error creating user"
        });

    }

};