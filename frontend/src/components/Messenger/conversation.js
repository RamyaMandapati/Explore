import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({
  conversation,
  currentUser,
  unreadCount,
  isSelected,
}) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("/api/user/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentUser && conversation) {
      getUser();
    }
  }, [currentUser, conversation]);

  return (
    <div className={`conversation ${isSelected ? "selected" : ""}`}>
      <img
        className="conversationImg"
        src={
          (user && user.profilePhoto) ||
          "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
        }
        alt=""
      />
      <span className="conversationName">{user && user.userName}</span>
      {unreadCount > 0 && (
        <span className="unreadcounter">{unreadCount}</span> // Displaying unread count
      )}
    </div>
  );
}
