import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import styles from "./Detail.module.css";

const Detail = () => {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const logout = () => {
    auth.signOut();
  };

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser?.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked
          ? arrayRemove(user?.id)
          : arrayUnion(user?.id),
      });
      changeBlock();
    } catch (error) {
      console.log("Ошибка при блокировке пользователя:", error);
    }
  };
  return (
    <div className={styles.detail}>
      <div className={styles.user}>
        <img
          src={user?.avatar || "./img/avatar.png"}
          alt=""
          className={styles.avatar}
        />
        <h2 className={styles.name}>{user?.username}</h2>
        <p className={styles.text}>Hey, how are you?</p>
      </div>
      <div className={styles.info}>
        <div className={styles.option}>
          <div className={styles.optionTitle}>
            <span>Chat Setting</span>
            <img src="./img/arrowUp.png" alt="" className={styles.arrow} />
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.optionTitle}>
            <span>Privacy & help</span>
            <img src="./img/arrowUp.png" alt="" className={styles.arrow} />
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.optionTitle}>
            <span>Shared photos</span>
            <img src="./img/arrowDown.png" alt="" className={styles.arrow} />
          </div>
          <div className={styles.photos}>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img
                  src="https://img.freepik.com/free-photo/woman-field-taking-photo_23-2147828098.jpg?t=st=1715637986~exp=1715641586~hmac=7e69a0b86d794fd8252afe9da4266cf4d575c98be1a19d33c1a11a998082e6cc&w=1380"
                  alt=""
                  className={styles.photoImg}
                />
                <span className={styles.photoName}>photo_2024_2.png</span>
              </div>
              <img
                src="./img/download.png"
                alt=""
                className={styles.downloadImg}
              />
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img
                  src="https://img.freepik.com/free-photo/woman-field-taking-photo_23-2147828098.jpg?t=st=1715637986~exp=1715641586~hmac=7e69a0b86d794fd8252afe9da4266cf4d575c98be1a19d33c1a11a998082e6cc&w=1380"
                  alt=""
                  className={styles.photoImg}
                />
                <span className={styles.photoName}>photo_2024_2.png</span>
              </div>
              <img
                src="./img/download.png"
                alt=""
                className={styles.downloadImg}
              />
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img
                  src="https://img.freepik.com/free-photo/woman-field-taking-photo_23-2147828098.jpg?t=st=1715637986~exp=1715641586~hmac=7e69a0b86d794fd8252afe9da4266cf4d575c98be1a19d33c1a11a998082e6cc&w=1380"
                  alt=""
                  className={styles.photoImg}
                />
                <span className={styles.photoName}>photo_2024_2.png</span>
              </div>
              <img
                src="./img/download.png"
                alt=""
                className={styles.downloadImg}
              />
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoDetail}>
                <img
                  src="https://img.freepik.com/free-photo/woman-field-taking-photo_23-2147828098.jpg?t=st=1715637986~exp=1715641586~hmac=7e69a0b86d794fd8252afe9da4266cf4d575c98be1a19d33c1a11a998082e6cc&w=1380"
                  alt=""
                  className={styles.photoImg}
                />
                <span className={styles.photoName}>photo_2024_2.png</span>
              </div>
              <img
                src="./img/download.png"
                alt=""
                className={styles.downloadImg}
              />
            </div>
          </div>
        </div>
        <button
          className={styles.blockButton + " " + styles.button}
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "Вы заблокированы"
            : isReceiverBlocked
            ? "Пользователь заблокирован"
            : "Заблокировать пользователя"}
        </button>
        <button
          className={styles.logoutButton + " " + styles.button}
          onClick={logout}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default Detail;
