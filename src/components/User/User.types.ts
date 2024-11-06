export interface IUserProps {
  name: string;
  text?: string | null;
  avatar?: string;
  icons?: React.ReactNode | null;
  iconWidth?: number;
  iconHeight?: number;
  textStyle?: React.CSSProperties;
  textsGap?: number;
}
