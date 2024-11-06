import ChatList from "./ChatList/ChatList";
import UserInfo from "./UserInfo/UserInfo";

import "./List.css";

const List = () => {
  return (
    <div className="list">
      <UserInfo />
      <ChatList />
    </div>
  );
};

export default List;
