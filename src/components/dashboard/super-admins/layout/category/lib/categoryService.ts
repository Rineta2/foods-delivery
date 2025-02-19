import { db } from "@/utils/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Make sure this matches exactly with your .env.local
const COLLECTION_NAME = "categoriesProducts";

export const categoryService = {
  async createCategory(categoryData: { name: string }) {
    if (!COLLECTION_NAME) {
      throw new Error("Collection name is not defined");
    }
    try {
      const data = {
        ...categoryData,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  },

  async getCategories() {
    if (!COLLECTION_NAME) {
      throw new Error("Collection name is not defined");
    }
    try {
      const categoriesCollection = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(categoriesCollection);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  async deleteCategory(id: string) {
    if (!COLLECTION_NAME) {
      throw new Error("Collection name is not defined");
    }
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  },

  async updateCategory(id: string, categoryData: { name: string }) {
    if (!COLLECTION_NAME) {
      throw new Error("Collection name is not defined");
    }
    try {
      const categoryRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  },
};
