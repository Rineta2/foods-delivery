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

const COLLECTION_NAME = process.env
  .NEXT_PUBLIC_COLLECTIONS_CATEGORY_PRODUCTS as string;

export const categoryProductService = {
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
                fileName: `category-product-${Date.now()}`,
                folder: "/category-products",
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

  async createCategoryProduct(data: CategoryProductFormData) {
    try {
      const categoryProductData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        categoryProductData
      );
      return { id: docRef.id, ...categoryProductData };
    } catch {
      throw new Error("Failed to create category product");
    }
  },

  async getCategoryProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CategoryProduct[];
    } catch {
      throw new Error("Failed to fetch discounts");
    }
  },

  async updateCategoryProduct(id: string, data: CategoryProductFormData) {
    try {
      const categoryProductRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(categoryProductRef, {
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
