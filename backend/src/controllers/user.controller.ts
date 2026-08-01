import { Request, Response } from "express";
import { createUser, updateUserRole, getAllUsers } from "../services/user.service";
import prisma from "../config/database";

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


    } catch (error: any) {

        res.status(400).json({
            message: error.message
        });

    }



};

export const getProfile = async (
    req: Request,
    res: Response
) => {

    try {

        const userId = (req.user as any).userId;


        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.json({
            message: "Profile accessed successfully",
            user
        });


    } catch(error) {

        res.status(500).json({
            message:"Server error"
        });

    }

};

export const updateUserRoleController = async (
    req: Request,
    res: Response
) => {

    try {
        const userId = Number(req.params.id);
        const { role } = req.body;

        const user = await updateUserRole(userId, role);

        res.json({
            message: "User role updated successfully",
            user
        });

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }

};

export const getAllUsersController = async (
    req: Request,
    res: Response
) => {

    try {
        const users = await getAllUsers();

        res.json({
            users
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }

};