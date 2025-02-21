import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { Discount } from "@/components/ui/discount/lib/interface";

export const fetchDiscounts = async (): Promise<Discount[]> => {
  try {
    const discountsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_DISCOUNTS as string
    );
    const q = query(discountsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Discount),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return [];
  }
};
