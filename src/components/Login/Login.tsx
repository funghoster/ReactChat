import { useState } from "react";
import { IUserAvatar } from "./Login.types";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

import styles from "./Login.module.css";
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState<IUserAvatar>({
    file: null,
    url: "./img/avatar.png",
  });
  const [loading, setLoading] = useState(false);

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const { email, password } = Object.fromEntries(formData);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
      toast.success("Успешно");
    } catch (error) {
      console.log(error);
      toast.warn("Ошибка входа" + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );

      const imgUrl = await upload(avatar.file as File);

      await setDoc(doc(db, "users", response.user.uid), {
        id: response.user.uid,
        username: username as string,
        email: email as string,
        avatar: imgUrl,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", response.user.uid), {
        chats: [],
      });

      toast.success("Аккаунт создан");
    } catch (error) {
      toast.error("Произошла ошибка: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.item}>
        <h2>Добро пожаловать</h2>
        <form className={styles.form} onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" name="email" />
          <input type="password" placeholder="Пароль" name="password" />
          <button disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.item}>
        <h2>Создать аккаунт</h2>
        <form className={styles.form} onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url} alt="" />
            Выберите фото профиля
          </label>
          <input
            type="file"
            id="file"
            className="visually-hidden"
            onChange={changeAvatar}
          />
          <input type="text" placeholder="E-mail" name="email" />
          <input type="text" placeholder="Имя пользователя" name="username" />
          <input type="password" placeholder="Пароль" name="password" />
          <button disabled={loading}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
