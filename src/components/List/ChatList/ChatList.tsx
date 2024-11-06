import { useCallback, useEffect, useState } from "react";
import "./ChatList.css";
import User from "../../User/User";
import Search from "../../Search/Search";
import AddUser from "./AddUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import {
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState<DocumentData[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    console.log("Текущие чаты:", chats);
  }, [chats]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser?.id),
      async (res) => {
        const items: DocumentData[] = res?.data()?.chats;
        if (!items || items.length === 0) {
          setChats([]);
          return;
        }
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item?.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();
          return {
            ...item,
            user,
          };
        });

        const result: DocumentData[] = await Promise.all(promises);
        console.log("result", result);
        setChats(result.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const changeMode = useCallback(() => {
    setAddMode((prev) => !prev);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const filteredChats = chats.filter((chat) => {
    if (!searchValue) return true;
    return (
      chat.user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const handleSelect = async (chat: DocumentData) => {
    console.log("Выбранный чат: ", chat);
    const userChats = chats.map((item) => {
      const { userChat, ...rest } = item;
      console.log("userChat", userChat);
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser?.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      console.log("chat.chatId, chat.user", chat.chatId, chat.user);
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-list">
      <Search
        mode={addMode}
        changeMode={changeMode}
        changeInput={handleSearch}
      />
      <ul>
        {filteredChats.map((chat) => (
          <li
            className="item"
            key={chat?.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <User
              avatar={chat.user.avatar || "./img/avatar.png"}
              name={chat.user.username}
              text={chat.lastMessage}
            ></User>
          </li>
        ))}
      </ul>
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
