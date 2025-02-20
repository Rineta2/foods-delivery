import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { CategoryProduct } from "@/components/ui/category/lib/interface";

export const fetchCategoryProducts = async (): Promise<CategoryProduct[]> => {
  try {
    const categoryProductsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORY_PRODUCTS as string
    );
    const q = query(categoryProductsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as CategoryProduct),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
};
