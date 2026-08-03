export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserRoleRequest {
  role: "CUSTOMER" | "ADMIN";
}