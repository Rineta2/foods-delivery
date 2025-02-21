export interface Partner {
  id: string;
  imageUrl: string;
  title: string;
  category: "partner" | "ride"; // 'partner' for Partner with Us, 'ride' for Ride with Us
  buttonText: string;
  link: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  text: string;
}

export interface PartnerFormData {
  imageUrl: string;
  title: string;
  category: "partner" | "ride";
  buttonText: string;
  link: string;
  isActive: boolean;
  text: string;
}
