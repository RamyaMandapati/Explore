import "./messenger.css";
import Conversation from "./conversation";
import Message from "./message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import socket from "./../../utils/socket";
import { useParams } from "react-router-dom";
import SearchMessage from "./SearchMessage";
export default function Messenger({ history }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const scrollRef = useRef();
  const scrollRef1 = useRef();
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const { messageNotifications } = useSelector(
    (state) => state.messageNotifications
  );
  // const [socketUser, setSocketUser] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        // Add the new notification to the state

        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });

      // return () => {
      //   socket.off("getMessage");
      // };
    }
  }, [socket]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      const receiverId = currentChat.members.find(
        (member) => member._id !== (user && user._id)
      );
      try {
        await axios.put("/api/messages/markAsRead", {
          conversationId: currentChat._id,
          sender: receiverId,
          userId: user && user._id,
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (
      arrivalMessage &&
      currentChat &&
      currentChat?.members.some(
        (member) => member._id === arrivalMessage.sender
      )
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
      markMessagesAsRead();
    }
    console.log("useeff", arrivalMessage);
  }, [arrivalMessage, currentChat]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  // useEffect(() => {
  //   // socket.current.emit("addUser", user._id);
  //   if (socket){
  //   socket.current.on("getUsers", (users) => {
  //     setOnlineUsers(
  //       user.followings.filter((f) => users.some((u) => u.userId === f))
  //     );
  //   });
  // }
  // }, [user, socket]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/api/conversation/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user && user._id) {
      getConversations();
    }
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    const foundConversation = async () => {
      try {
        let res = await axios.get("/api/conversations/" + conversationId);
        if (res) {
          setCurrentChat(res.data);
          setSelectedConversation(res.data._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (conversationId) {
      foundConversation();
    }
  }, [conversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member._id !== (user && user._id)
    );
    const message = {
      sender: user && user._id,
      text: newMessage,
      conversationId: currentChat._id,
      receiverId: receiverId._id,
    };
    socket.emit("sendMessage", {
      senderId: user && user._id,
      receiverId: receiverId._id,
      text: newMessage,
    });
    try {
      const res = await axios.post("/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleConversationClick = async (conversation) => {
    // setCurrentChat(conversation);
    const receiverId = conversation.members.find(
      (member) => member._id !== (user && user._id)
    );
    try {
      await axios.put("/api/messages/markAsRead", {
        conversationId: conversation._id,
        sender: receiverId,
        userId: user && user._id,
      });
      history.push(`/messenger/${conversation._id}`);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    scrollRef1.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const otherMember =
    currentChat &&
    currentChat.members.find((member) => member._id !== (user && user._id));
  return (
    <>
      {/* <Topbar /> */}
      <div className="messenger">
        <div className="chatMenu">
          <div
            className="chatMenuWrapper"
            style={{ borderRight: "1px solid #d4d4d4" }}
          >
            <h2 style={{ fontSize: "25px", marginBottom: "20px" }}>Chats</h2>
            <SearchMessage />

            <div className="conversationBox">
              <div ref={scrollRef1}>
                {/* {conversations.map((c) => (
                  <div onClick={() => handleConversationClick(c)}>
                    <Conversation conversation={c} currentUser={user} />
                  </div>
                ))} */}
                {conversations.map((conversation) => {
                  // Assuming you have a way to find the notification for this conversation
                  const notification =
                    messageNotifications.length !== 0 &&
                    messageNotifications.find(
                      (n) => n.conversationId === conversation._id
                    );
                  const unreadCount = notification
                    ? notification.unreadCount
                    : 0;

                  return (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <Conversation
                        conversation={conversation}
                        currentUser={user}
                        unreadCount={unreadCount}
                        isSelected={selectedConversation === conversation._id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="chatBox">
          <div
            className="chatBoxWrapper"
            style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}
          >
            {currentChat ? (
              <>
                <div
                  style={{
                    // borderBottom: "1px solid #d4d4d4",
                    height: "64px",
                    // backgroundColor: "#f3f4f5",
                    // boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                    width: "100%",
                    // paddingLeft: "-10px",
                  }}
                >
                  {otherMember && (
                    <div
                      className="conversation"
                      style={{ marginTop: 0 }}
                      onClick={() =>
                        history.push(
                          `/profile/${otherMember && otherMember._id}`
                        )
                      }
                    >
                      <img
                        className="conversationImg"
                        src={
                          otherMember.profilePhoto ||
                          "https://res.cloudinary.com/dylqg3itm/image/upload/v1700327154/explore/default-avatar-profile-icon-of-social-media-user-vector_gqejru.jpg"
                        }
                        alt={otherMember.userName}
                      />
                      <span className="conversationName">
                        {otherMember.userName}
                      </span>
                    </div>
                  )}
                </div>
                <div className="chatBoxTop">
                  <div ref={scrollRef}>
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.sender === (user && user._id)}
                          otherMember={otherMember && otherMember}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        {/* <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div> */}
      </div>
    </>
  );
}
