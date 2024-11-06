import { DocumentData } from "firebase/firestore";
import { create } from "zustand";
import { useUserStore } from "./userStore";

type nullDocumentData = null | DocumentData;

type State = {
  chatId: string | null;
  user: nullDocumentData;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
};

type Actions = {
  changeChat: (uid: string, user: DocumentData) => void;
  changeBlock: () => void;
};

export const useChatStore = create<State & Actions>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (uid: string, user: DocumentData) => {
    const currentUser = useUserStore.getState().currentUser;
    console.log(user);
    if (user.blocked.includes(currentUser?.id as string)) {
      return set({
        chatId: uid,
        user: user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser?.blocked.includes(user?.id as string)) {
      return set({
        chatId: uid,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId: uid,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },

  changeBlock: () => {
    set((state) => ({
      ...state,
      isCurrentUserBlocked: !state.isCurrentUserBlocked,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));
