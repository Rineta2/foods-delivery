interface Step {
  image: string;
  text: string;
  title: string;
}

interface FaqType {
  steps: Step[];
  title: string;
}

export interface Faq {
  id: string;
  category: string;
  createdAt: string;
  isActive: boolean;
  types: FaqType[];
  updatedAt: string;
}
