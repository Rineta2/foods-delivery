import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { CategoryProduct } from "@/components/ui/category/lib/interface";

export const fetchCategoryProducts = (
  callback: (products: CategoryProduct[]) => void
) => {
  try {
    const categoryProductsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_CATEGORY_PRODUCTS as string
    );
    const q = query(categoryProductsRef, where("isActive", "==", true));

    // Return unsubscribe function
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as CategoryProduct),
        id: doc.id,
      }));
      callback(products);
    });
  } catch (error) {
    console.error("Error subscribing to category products:", error);
    return () => {};
  }
};
