import { db } from "@/utils/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import imagekitInstance from "@/utils/imagekit";

import {
  CategoryProduct,
  CategoryProductFormData,
} from "@/components/dashboard/super-admins/layout/category-product/lib/interface";

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTIONS_BRANDS as string;

export const brandService = {
  async uploadImage(file: File) {
    try {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            if (e.target?.result) {
              const base64Image = e.target.result.toString().split(",")[1];
              const uploadResponse = await imagekitInstance.upload({
                file: base64Image,
                fileName: `brand-${Date.now()}`,
                folder: "/brands",
              });
              resolve(uploadResponse.url);
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    } catch {
      throw new Error("Failed to upload image");
    }
  },

  async createBrand(data: CategoryProductFormData) {
    try {
      const brandData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), brandData);
      return { id: docRef.id, ...brandData };
    } catch {
      throw new Error("Failed to create brand");
    }
  },

  async getBrands() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CategoryProduct[];
    } catch {
      throw new Error("Failed to fetch brands");
    }
  },

  async updateBrand(id: string, data: CategoryProductFormData) {
    try {
      const brandRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(brandRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update brand");
    }
  },

  async deleteBrand(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch {
      throw new Error("Failed to delete brand");
    }
  },

  async updateBrandStatus(id: string, isActive: boolean) {
    try {
      const brandRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(brandRef, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update brand status");
    }
  },

  // Add other methods similar to bannerService
};
