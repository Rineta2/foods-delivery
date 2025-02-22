export interface Step {
  title: string;
  text: string;
  image?: string;
}

export interface FAQType {
  title: string;
  steps: Step[];
}

export interface FAQ {
  id: string;
  category: string;
  types: FAQType[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FAQFormData {
  category: string;
  types: FAQType[];
  isActive: boolean;
}
