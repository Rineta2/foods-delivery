import { collection, query, where, onSnapshot } from "firebase/firestore";

import { db } from "@/utils/firebase";

export interface Banner {
  id: string;
  title: string;
  createdAt: string;
  imageUrl: string;
  isActive: boolean;
}

export function subscribeToBanners(callback: (banners: Banner[]) => void) {
  const bannersCollection = collection(db, "banners");
  const bannersQuery = query(bannersCollection, where("isActive", "==", true));

  // Return unsubscribe function
  return onSnapshot(bannersQuery, (snapshot) => {
    const banners = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Banner[];
    callback(banners);
  });
}
