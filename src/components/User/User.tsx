import { memo, useEffect } from "react";

import styles from "./User.module.css";

import { IUserProps } from "./User.types";
const User = memo(
  ({
    avatar = "/img/avatar.png",
    name,
    icons = null,
    text = null,
    iconWidth = 50,
    iconHeight = 50,
    textStyle = {},
    textsGap = 10,
  }: IUserProps) => {
    useEffect(() => {
      console.log("User render");
    });
    return (
      <div className={styles.user}>
        <div className={styles.nameWrapper}>
          <img
            src={avatar}
            alt=""
            className={styles.avatar}
            style={{ width: iconWidth, height: iconHeight }}
          />
          <div className={styles.texts} style={{ gap: textsGap }}>
            <h2 className={styles.name}>{name}</h2>
            {text && (
              <p className={styles.text} style={textStyle}>
                {text}
              </p>
            )}
          </div>
        </div>
        <div className={styles.icons}>{icons && icons}</div>
      </div>
    );
  }
);

export default User;
