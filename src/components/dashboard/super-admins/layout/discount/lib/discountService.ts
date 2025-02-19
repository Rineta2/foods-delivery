import { db } from "@/utils/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { compressImage } from "@/components/helper/imageCompression";
import imagekitInstance from "@/utils/imagekit";
import {
  Discount,
  DiscountFormData,
} from "@/components/dashboard/super-admins/layout/discount/lib/interface";

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTIONS_DISCOUNTS as string;

export const discountService = {
  async uploadImage(file: File) {
    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            if (e.target?.result) {
              const base64Image = e.target.result.toString().split(",")[1];
              const uploadResponse = await imagekitInstance.upload({
                file: base64Image,
                fileName: `discount-${Date.now()}`,
                folder: "/discounts",
              });
              resolve(uploadResponse.url);
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(compressedFile);
      });
    } catch {
      throw new Error("Failed to upload image");
    }
  },

  async createDiscount(data: DiscountFormData) {
    try {
      const discountData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        discountData
      );
      return { id: docRef.id, ...discountData };
    } catch {
      throw new Error("Failed to create discount");
    }
  },

  async getDiscounts() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Discount[];
    } catch {
      throw new Error("Failed to fetch discounts");
    }
  },

  async updateDiscount(id: string, data: DiscountFormData) {
    try {
      const discountRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(discountRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update discount");
    }
  },

  async deleteDiscount(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch {
      throw new Error("Failed to delete discount");
    }
  },

  async updateDiscountStatus(id: string, isActive: boolean) {
    try {
      const discountRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(discountRef, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update discount status");
    }
  },

  // Add other methods similar to bannerService
};
