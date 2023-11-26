import "./message.css";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

export default function Message({ message, own, otherMember }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className={own ? "messagechat own" : "messagechat"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            own
              ? user && user.profilePhoto
              : otherMember.profilePhoto ||
                "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
          }
          alt=""
        />
        <p className="messageText">{message && message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
