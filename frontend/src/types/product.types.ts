export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  imageUrl?: string | null;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
}