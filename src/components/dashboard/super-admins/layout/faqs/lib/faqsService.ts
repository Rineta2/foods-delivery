import { db } from "@/utils/firebase";

import imagekit from "@/utils/imagekit";

import { compressImage } from "@/components/helper/imageCompression";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  FAQ,
  FAQFormData,
} from "@/components/dashboard/super-admins/layout/faqs/lib/interface";

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTIONS_FAQS as string;

export const faqService = {
  async uploadImage(file: File): Promise<string> {
    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });

      const base64 = await base64Promise;
      const result = await imagekit.upload({
        file: base64,
        fileName: `faq-${Date.now()}`,
        folder: "/faqs",
      });

      return result.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  },

  async createFAQ(data: FAQFormData): Promise<FAQ> {
    try {
      const faqData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), faqData);
      return { id: docRef.id, ...faqData } as FAQ;
    } catch (error) {
      console.error("Error creating FAQ:", error);
      throw new Error("Failed to create FAQ");
    }
  },

  async getFAQs(): Promise<FAQ[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FAQ[];
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      throw new Error("Failed to fetch FAQs");
    }
  },

  async updateFAQ(id: string, data: Partial<FAQFormData>): Promise<void> {
    try {
      const faqRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(faqRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      throw new Error("Failed to update FAQ");
    }
  },

  async deleteFAQ(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw new Error("Failed to delete FAQ");
    }
  },

  async toggleFAQStatus(id: string, isActive: boolean): Promise<void> {
    try {
      const faqRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(faqRef, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error toggling FAQ status:", error);
      throw new Error("Failed to toggle FAQ status");
    }
  },
};
