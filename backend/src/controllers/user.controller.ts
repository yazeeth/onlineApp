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

export const updateProfile = async (
    req: Request,
    res: Response
) => {

    try {
        const userId = (req.user as any).userId;
        const { name, email, phone } = req.body;

        if (name !== undefined && typeof name !== "string") {
            return res.status(400).json({
                message: "Name must be a string"
            });
        }

        if (email !== undefined && typeof email !== "string") {
            return res.status(400).json({
                message: "Email must be a string"
            });
        }

        if (phone !== undefined && typeof phone !== "string") {
            return res.status(400).json({
                message: "Phone must be a string"
            });
        }

        if (email !== undefined) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email.trim().toLowerCase(),
                    NOT: {
                        id: userId
                    }
                }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already in use"
                });
            }
        }

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...(name !== undefined ? { name: name.trim() } : {}),
                ...(email !== undefined ? { email: email.trim().toLowerCase() } : {}),
                ...(phone !== undefined ? { phone: phone.trim() || null } : {})
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });

        return res.json({
            message: "Profile updated successfully",
            user
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Server error"
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