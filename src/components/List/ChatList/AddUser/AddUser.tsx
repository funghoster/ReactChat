import {
  DocumentData,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import User from "../../../User/User";
import styles from "./AddUser.module.css";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState<DocumentData | null>(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data() || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Ошибка поиска пользователя:", error);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser?.id,
          updateAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user?.id,
          updateAt: Date.now(),
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.addUser}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input type="text" placeholder="Имя пользователя" name="username" />
        <button>Искать</button>
      </form>
      {user && (
        <div className={styles.user}>
          <User
            name={user?.username}
            avatar={user?.avatar || "./img/avatar.png"}
          />
          <button className={styles.addButton} onClick={handleAdd}>
            Добавить
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
