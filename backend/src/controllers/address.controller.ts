import { Request, Response } from "express";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  updateAddress,
} from "../services/address.service";

const getUserId = (req: Request): number => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const addresses = await getUserAddresses(userId);

    res.status(200).json(addresses);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get addresses";
    const status = message === "Unauthorized" ? 401 : 500;

    res.status(status).json({ message });
  }
};

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const {
      fullName,
      phone,
      street,
      city,
      country,
      postalCode,
    } = req.body;

    if (!fullName || !phone || !street || !city || !country || !postalCode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    const address = await createAddress(userId, {
      fullName,
      phone,
      street,
      city,
      country,
      postalCode,
    });

    return res.status(201).json(address);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create address";
    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({ message });
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const {
      fullName,
      phone,
      street,
      city,
      country,
      postalCode,
    } = req.body;

    const address = await updateAddress(userId, addressId, {
      fullName,
      phone,
      street,
      city,
      country,
      postalCode,
    });

    return res.status(200).json(address);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update address";

    if (message === "Unauthorized") {
      return res.status(401).json({ message });
    }

    if (message === "Address not found") {
      return res.status(404).json({ message });
    }

    return res.status(500).json({ message });
  }
};

export const removeAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const addressId = Number(req.params.id);

    if (!Number.isInteger(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    await deleteAddress(userId, addressId);

    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete address";

    if (message === "Unauthorized") {
      return res.status(401).json({ message });
    }

    if (message === "Address not found") {
      return res.status(404).json({ message });
    }

    return res.status(500).json({ message });
  }
};