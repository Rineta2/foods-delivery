import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { Faq } from "./interface";

export const fetchFaqs = async (): Promise<Faq[]> => {
  try {
    const faqsRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_FAQS as string
    );
    const q = query(faqsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Faq),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching faqs:", error);
    return [];
  }
};
