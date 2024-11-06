import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageInput from "../MessageInput/MessageInput";
import User from "../User/User";

import styles from "./Chat.module.css";
import {
  DocumentData,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { imgFile } from "../MessageInput/MessageInput.types";

const Chat = () => {
  const [chat, setChat] = useState<DocumentData>();

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Пользователь чата: ", user);
  }, [chat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChat(res.data());
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  const textStyle = useMemo(() => {
    return { fontSize: 14, color: "#a5a5a5" };
  }, []);

  const icons = useMemo(
    () => (
      <>
        <img src="./img/phone.png" alt="" className={styles.icon} />
        <img src="./img/video.png" alt="" className={styles.icon} />
        <img src="./img/info.png" alt="" className={styles.icon} />
      </>
    ),
    []
  );

  const handleSendClick = useCallback(async (text: string, imgUrl: imgFile) => {
    console.log("Изображение: ", imgUrl, "Текст: ", text);
    if (text === "" && !imgUrl.file) return;
    let imgCurrentUrl = null;
    try {
      if (imgUrl.file) {
        imgCurrentUrl = await upload(imgUrl.file as File);
      }
      if (chatId) {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser?.id,
            text,
            createdAt: new Date(),
            ...(!!imgCurrentUrl && { img: imgCurrentUrl }),
          }),
        });
      }
      const userIds = [currentUser?.id, user?.id];

      userIds.forEach(async (userId) => {
        const userChatRef = doc(db, "userchats", userId);
        const userChatSnapshot = await getDoc(userChatRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (chat: DocumentData) => chat.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage =
            text === "" ? "Изображение" : text;
          userChatsData.chats[chatIndex].isSeen = userId === currentUser?.id;
          userChatsData.chats[chatIndex].updateAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log("Ошибка при отправке сообщения", error);
    }
  }, []);

  return (
    <div className={styles.chat}>
      <div className={styles.top}>
        <User
          name={user?.username}
          icons={icons}
          avatar={user?.avatar}
          text="Lorem ipsum dolor sit amet"
          iconHeight={60}
          iconWidth={60}
          textStyle={textStyle}
          textsGap={8}
        />
      </div>
      <div className={styles.center}>
        {chat?.messages?.map((message: DocumentData) => {
          const isOwn = message.senderId === currentUser?.id;
          console.log("Изображение сообщения", message.img);
          return (
            <div
              className={styles.message + " " + (isOwn ? styles.own : " ")}
              key={message.createdAt}
            >
              {!isOwn && (
                <img
                  src={user?.avatar || "./img/avatar.png"}
                  alt=""
                  className={styles.avatar}
                />
              )}
              <div className={styles.text}>
                <p>
                  {message.img && <img src={message.img} alt="" />}
                  {message.text}
                </p>
                <span>1 min ago</span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>
      <div className={styles.bottom}>
        <MessageInput
          handleSendClick={handleSendClick}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
      </div>
    </div>
  );
};

export default Chat;
