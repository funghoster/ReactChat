import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import styles from "./MessageInput.module.css";
import { Actions, IMessageInputProps, State } from "./MessageInput.types";
import { memo, useEffect, useReducer } from "react";

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "SET_TEXT":
      if (typeof action.payload !== "string") return state;
      return { ...state, text: action.payload };
    case "SET_SHOW_EMOJI":
      if (typeof action.payload !== "boolean") return state;
      return { ...state, showEmoji: action.payload };
    case "SET_IMG":
      if (typeof action.payload !== "object") return state;
      console.log("action.payload", action.payload);
      return { ...state, img: action.payload };
    case "CLEAR_STATE":
      return { text: "", showEmoji: false, img: { file: null, url: "" } };
    default:
      return state;
  }
};

const MessageInput = memo(
  ({ handleSendClick, disabled }: IMessageInputProps) => {
    const [{ text, showEmoji, img }, dispatch] = useReducer(reducer, {
      text: "",
      showEmoji: false,
      img: {
        file: null,
        url: "",
      },
    });

    useEffect(() => {
      console.log("Перерисовка компонента MessageInput");
    }, []);

    const openEmoji = () => {
      dispatch({ type: "SET_SHOW_EMOJI", payload: !showEmoji });
    };

    const handleEmojiClick = (emoji: EmojiClickData) => {
      dispatch({ type: "SET_TEXT", payload: text + emoji.emoji });
      dispatch({ type: "SET_SHOW_EMOJI", payload: false });
    };

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        dispatch({
          type: "SET_IMG",
          payload: {
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]),
          },
        });
      }
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.icons}>
          <label htmlFor="file" className={styles.label}>
            <img src="./img/img.png" alt="" className={styles.icon} />
          </label>
          <input
            id="file"
            type="file"
            className="visually-hidden"
            onChange={handleImgUpload}
          />
          <img src="./img/camera.png" alt="" className={styles.icon} />
          <img src="./img/mic.png" alt="" className={styles.icon} />
          {img.url && <img src={img.url} alt="" className={styles.icon} />}
        </div>
        <input
          type="text"
          placeholder={
            disabled ? "Сообщение отключено" : "Введите сообщение..."
          }
          className={styles.input}
          value={text}
          onChange={(e) =>
            dispatch({ type: "SET_TEXT", payload: e.target.value })
          }
          disabled={disabled}
        />
        <div className={styles.emoji}>
          <img
            src="./img/emoji.png"
            alt=""
            className={styles.icon}
            onClick={openEmoji}
          />
          <div className={styles.picker}>
            <EmojiPicker open={showEmoji} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
        <button
          className={styles.sendButton}
          onClick={(e) => {
            handleSendClick(text, img, showEmoji, e);
            dispatch({ type: "CLEAR_STATE" });
          }}
          disabled={disabled}
        >
          Отправить
        </button>
      </div>
    );
  }
);

export default MessageInput;
