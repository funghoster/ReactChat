export interface ISearchProps {
  mode: boolean;
  changeMode: () => void;
  changeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
