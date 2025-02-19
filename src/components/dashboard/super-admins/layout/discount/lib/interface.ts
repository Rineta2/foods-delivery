export interface Discount {
  id: string;
  imageUrl: string;
  title: string;
  discountAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  category: string;
}

export interface DiscountFormData {
  imageUrl: string;
  title: string;
  discountAmount: number;
  isActive: boolean;
  category: string;
}
