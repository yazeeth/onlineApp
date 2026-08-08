

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