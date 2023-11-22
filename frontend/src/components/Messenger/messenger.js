import "./messenger.css";
import Conversation from "./conversation";
import Message from "./message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import socket from "./../../utils/socket";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const scrollRef = useRef();
  const scrollRef1 = useRef();

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
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
    console.log("useeff", messages);
  }, [arrivalMessage, currentChat]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    const message = {
      sender: user && user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    socket.emit("sendMessage", {
      senderId: user && user._id,
      receiverId,
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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    scrollRef1.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* <Topbar /> */}
      <div className="messenger">
        <div className="chatMenu">
          <div
            className="chatMenuWrapper"
            style={{ borderRight: "2px solid #f3f4f5" }}
          >
            <h2>Chats</h2>
            <input placeholder="Search for friends" className="chatMenuInput" />

            <div className="conversationBox">
              <div ref={scrollRef1}>
                {conversations.map((c) => (
                  <div onClick={() => setCurrentChat(c)}>
                    <Conversation conversation={c} currentUser={user} />
                  </div>
                ))}
              </div>
              <div></div>
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
                    // borderBottom: "2px solid #f3f4f5",
                    height: "64px",
                    // backgroundColor: "#f3f4f5",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                    // paddingLeft: "-10px",
                  }}
                >
                  <div className="conversation" style={{ marginTop: 0 }}>
                    <img
                      className="conversationImg"
                      src="https://res.cloudinary.com/dylqg3itm/image/upload/v1700009042/explore/sf_zjvbxi.jpg"
                      alt=""
                    />
                    <span className="conversationName">Rakshith</span>
                  </div>
                </div>
                <div className="chatBoxTop">
                  <div ref={scrollRef}>
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.sender === (user && user._id)}
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
