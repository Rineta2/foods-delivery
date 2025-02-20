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

import { Banner } from "@/components/dashboard/super-admins/layout/home/lib/interface";

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTIONS_BANNERS as string;

export const bannerService = {
  async uploadImage(file: File) {
    try {
      // Convert to base64
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            if (e.target?.result) {
              const base64Image = e.target.result.toString().split(",")[1];

              // Upload to ImageKit
              const uploadResponse = await imagekitInstance.upload({
                file: base64Image,
                fileName: `banner-${Date.now()}`,
                folder: "/banners",
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

  async createBanner(imageUrl: string) {
    try {
      const bannerData = {
        imageUrl,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), bannerData);
      return { id: docRef.id, ...bannerData };
    } catch {
      throw new Error("Failed to create banner");
    }
  },

  async getBanners() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Banner[];
    } catch {
      throw new Error("Failed to fetch banners");
    }
  },

  async updateBannerStatus(id: string, isActive: boolean) {
    try {
      const bannerRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(bannerRef, { isActive });
    } catch {
      throw new Error("Failed to update banner");
    }
  },

  async deleteBanner(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch {
      throw new Error("Failed to delete banner");
    }
  },

  async updateBanner(
    id: string,
    data: { imageUrl: string; isActive: boolean }
  ) {
    try {
      const bannerRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(bannerRef, {
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update banner");
    }
  },
};
