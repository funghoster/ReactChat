export type imgFile = { file: File | null; url: string };

export interface IMessageInputProps {
  handleSendClick: (
    text: string,
    imgUrl: imgFile,
    showEmoji: boolean,
    e: React.FormEvent
  ) => void;
  disabled: boolean;
}

export type State = {
  text: string;
  showEmoji: boolean;
  img: imgFile;
};

export type Actions = {
  type: "SET_TEXT" | "SET_SHOW_EMOJI" | "SET_IMG" | "CLEAR_STATE";
  payload?: string | boolean | imgFile;
};
