import { useUserStore } from "../../../lib/userStore";
import User from "../../User/User";
import "./UserInfo.css";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const icons = (
    <>
      <img src="./img/more.png" alt="" />
      <img src="./img/video.png" alt="" />
      <img src="./img/edit.png" alt="" />
    </>
  );
  return (
    <div className="user-info">
      <User
        name={currentUser?.username}
        icons={icons}
        avatar={currentUser?.avatar || "./img/avatar.png"}
      ></User>
    </div>
  );
};

export default UserInfo;
