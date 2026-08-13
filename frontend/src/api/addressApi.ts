import api from "./axios";

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface CreateAddressInput {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export type UpdateAddressInput = Partial<CreateAddressInput>;

export const getAddresses = async (): Promise<Address[]> => {
  const response = await api.get<Address[]>('/addresses');
  return response.data;
};

export const createAddress = async (
  data: CreateAddressInput,
): Promise<Address> => {
  const response = await api.post<Address>('/addresses', data);
  return response.data;
};

export const updateAddress = async (
  id: number,
  data: UpdateAddressInput,
): Promise<Address> => {
  const response = await api.put<Address>(`/addresses/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};

export const getAdminCustomerAddresses = async (
  userId: number,
): Promise<Address[]> => {
  const response = await api.get<Address[]>(`/addresses/admin/users/${userId}`);
  return response.data;
};

export const addAdminCustomerAddress = async (
  userId: number,
  data: CreateAddressInput,
): Promise<Address> => {
  const response = await api.post<Address>(
    `/addresses/admin/users/${userId}`,
    data,
  );
  return response.data;
};

export const editAdminCustomerAddress = async (
  userId: number,
  addressId: number,
  data: UpdateAddressInput,
): Promise<Address> => {
  const response = await api.put<Address>(
    `/addresses/admin/users/${userId}/${addressId}`,
    data,
  );
  return response.data;
};

export const removeAdminCustomerAddress = async (
  userId: number,
  addressId: number,
): Promise<void> => {
  try {
    await api.delete(`/addresses/admin/users/${userId}/${addressId}`);
  } catch (error) {
    const responseMessage =
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null &&
      "message" in error.response.data
        ? String(error.response.data.message)
        : "";

    if (
      responseMessage.includes("Order_addressId_fkey") ||
      responseMessage.includes("Foreign key constraint violated")
    ) {
      throw new Error("Cannot delete this address. It is tied to one or more existing orders.");
    }

    throw error;
  }
};