export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserRoleRequest {
  role: "CUSTOMER" | "ADMIN";
}