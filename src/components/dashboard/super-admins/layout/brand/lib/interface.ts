export interface Brand {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BrandFormData {
  imageUrl: string;
  title: string;
  isActive: boolean;
}
