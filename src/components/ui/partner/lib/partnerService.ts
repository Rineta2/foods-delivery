import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/utils/firebase";

import { PartnerType } from "@/components/ui/partner/lib/interface";

export const fetchPartners = async (): Promise<PartnerType[]> => {
  try {
    const partnersRef = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_PARTNERS as string
    );
    const q = query(partnersRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as PartnerType),
      id: doc.id,
    }));
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
};
