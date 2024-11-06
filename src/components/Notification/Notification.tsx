import { ToastContainer } from "react-toastify";
import styles from "./Notification.module.css";

import "react-toastify/dist/ReactToastify.css";
const Notification = () => {
  return (
    <div className={styles.notification}>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Notification;
