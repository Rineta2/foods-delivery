export interface CategoryProduct {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryProductFormData {
  imageUrl: string;
  title: string;
  isActive: boolean;
}
