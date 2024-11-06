import { DocumentData, doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

type State = {
  currentUser: null | DocumentData;
  isLoading: boolean;
};

type Actions = {
  fetchUserInfo: (uid: string) => void;
};

export const useUserStore = create<State & Actions>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string) => {
    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
