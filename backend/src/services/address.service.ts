import prisma from "../config/database";

export interface CreateAddressInput {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface UpdateAddressInput {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export const getUserAddresses = async (userId: number) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
};

export const createAddress = async (
  userId: number,
  data: CreateAddressInput,
) => {
  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      street: data.street,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
    },
  });
};

export const updateAddress = async (
  userId: number,
  addressId: number,
  data: UpdateAddressInput,
) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
};

export const deleteAddress = async (userId: number, addressId: number) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return prisma.address.delete({
    where: { id: addressId },
  });
};