

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  addAddress,
  editAddress,
  getAddresses,
  removeAddress,
} from "../controllers/address.controller";

const router = Router();

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get the authenticated user's addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses belonging to the authenticated user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to get addresses
 */
router.get("/", authMiddleware, getAddresses);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create an address for the authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - street
 *               - city
 *               - country
 *               - postalCode
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Aaminah Najeeb
 *               phone:
 *                 type: string
 *                 example: "+94771234567"
 *               street:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: Colombo
 *               country:
 *                 type: string
 *                 example: Sri Lanka
 *               postalCode:
 *                 type: string
 *                 example: "00100"
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Required address field is missing
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create address
 */
router.post("/", authMiddleware, addAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update an authenticated user's address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Invalid address ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Failed to update address
 */
router.put("/:id", authMiddleware, editAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete an authenticated user's address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       204:
 *         description: Address deleted successfully
 *       400:
 *         description: Invalid address ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Failed to delete address
 */
router.delete("/:id", authMiddleware, removeAddress);

export default router;