import { memo, useEffect } from "react";
import "./Search.css";
import { ISearchProps } from "./Search.types";

const Search = memo(({ mode, changeMode, changeInput }: ISearchProps) => {
  useEffect(() => {
    console.log("Перерисовка компонента Search");
  });
  return (
    <div className="search">
      <div className="search-bar">
        <img src="./img/search.png" alt="" />
        <input type="text" placeholder="Search" onChange={changeInput} />
      </div>
      <img
        src={mode ? "./img/minus.png" : "./img/plus.png"}
        alt=""
        className="add"
        onClick={changeMode}
      />
    </div>
  );
});

export default Search;
