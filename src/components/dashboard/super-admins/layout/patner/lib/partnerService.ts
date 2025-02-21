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

import { Partner, PartnerFormData } from "./interface";

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTIONS_PARTNERS as string;

export const partnerService = {
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
                fileName: `partner-${Date.now()}`,
                folder: "/partners",
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

  async createPartner(data: PartnerFormData) {
    try {
      const partnerData = {
        ...data,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), partnerData);
      return { id: docRef.id, ...partnerData };
    } catch {
      throw new Error("Failed to create partner");
    }
  },

  async getPartners() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Partner[];
    } catch {
      throw new Error("Failed to fetch partners");
    }
  },

  async updatePartner(id: string, data: PartnerFormData) {
    try {
      const partnerRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(partnerRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update partner");
    }
  },

  async deletePartner(id: string) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch {
      throw new Error("Failed to delete partner");
    }
  },

  async updatePartnerStatus(id: string, isActive: boolean) {
    try {
      const partnerRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(partnerRef, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      throw new Error("Failed to update partner status");
    }
  },
};
