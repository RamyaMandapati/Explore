import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
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
    <div className="conversation">
      <img
        className="conversationImg"
        src="https://res.cloudinary.com/dylqg3itm/image/upload/v1700009042/explore/sf_zjvbxi.jpg"
        alt=""
      />
      <span className="conversationName">{user && user.userName}</span>
    </div>
  );
}
