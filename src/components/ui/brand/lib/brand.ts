import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { Brand } from "@/components/ui/brand/lib/interface";

export function FetchBrands(callback: (brands: Brand[]) => void) {
  const brandsCollection = collection(
    db,
    process.env.NEXT_PUBLIC_COLLECTIONS_BRANDS as string
  );
  const brandsQuery = query(brandsCollection, where("isActive", "==", true));

  // Return unsubscribe function
  return onSnapshot(brandsQuery, (snapshot) => {
    const brands = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Brand[];
    callback(brands);
  });
}
