import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faBell } from "@fortawesome/free-solid-svg-icons"; // Import the messenger icon
import "./Navbar.css"; // You can create a CSS file for styling
import logo from "../../logo.png";
import profile from "../../profilepic.jpeg";
import { Travelfeed } from "../dashboard/Travelfeed.js";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../actions/types";
import { useHistory } from "react-router-dom";
import { loadUser } from "../../actions/auth";
import Menu from "@mui/material/Menu";
import io from "socket.io-client";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import ListItemIcon from "@mui/material/ListItemIcon";
import socket from "./../../utils/socket";

const Navbar = () => {
  const history = useHistory();

  const { user } = useSelector((state) => state.auth);
  const { messageNotifications } = useSelector(
    (state) => state.messageNotifications
  );
  const totalUnread = messageNotifications.reduce(
    (sum, n) => (n.unreadCount > 0 ? sum + 1 : sum),
    0
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  // Function to toggle the profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorNotification, setAnchorNotification] = React.useState(null);

  const handleOpenNotificationMenu = (event) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorNotification(null);
  };

  const [socketUser, setSocketUser] = useState("");

  useEffect(() => {
    if (user && user._id && socket) {
      console.log(socket);
      socket?.emit("newSocketUser", user._id);
      socket.on("socketUserInfo", (data) => {
        setSocketUser(data);
      });
      socket.emit("requestNotifications", {
        senderName: user._id,
      });
      socket.on("getNotifications", (data) => {
        const unreadNotifications = data.filter(
          (notification) => notification.isRead === false
        );
        setNotifications(data);
        setUnreadNotifications(unreadNotifications);
      });

      return () => {
        socket.off("getNotifications");
      };
    }
  }, [user, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (notification) => {
        // Add the new notification to the state
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
        if (!notification.isRead) {
          setUnreadNotifications((prevUnread) => [notification, ...prevUnread]);
        }
      });
      // console.log('hey', notifications);
      return () => {
        socket.off("newNotification");
      };
    }
  }, [socket]);
  console.log(notifications);
  const handleNotificationWithItinerary = async (
    notificationId,
    itineraryId
  ) => {
    axios
      .put("/api/notification", { notificationId: notificationId })
      .then((response) => {
        if (response.data.success) {
          const responseData = response.data.notification;
          const updatedUnreadNotifications = unreadNotifications.filter(
            (notification) => notification._id !== responseData._id
          );
          setUnreadNotifications(updatedUnreadNotifications);

          history.push(`/itinerary/${itineraryId}`);
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const handleNotification = async (notificationId, receiverId) => {
    axios
      .put("/api/notification", { notificationId: notificationId })
      .then((response) => {
        if (response.data.success) {
          const responseData = response.data.notification;
          const updatedUnreadNotifications = unreadNotifications.filter(
            (notification) => notification._id !== responseData._id
          );
          setUnreadNotifications(updatedUnreadNotifications);

          history.push(`/profile/${receiverId}`);
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const handleAcceptRequest = (e, notificationId, itineraryId, memberId) => {
    e.stopPropagation();
    const data = {
      itineraryId: itineraryId,
      notificationId: notificationId,
      type: "ACCEPT",
      memberId: memberId,
    };
    axios
      .put("/api/itinerary/members", data)
      .then((response) => {
        if (response.data.success) {
          const responseData = response.data.notification;
          const updatedUnreadNotifications = unreadNotifications.filter(
            (notification) => notification._id !== responseData._id
          );
          setUnreadNotifications(updatedUnreadNotifications);
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const handleRejectRequest = (e, notificationId, itineraryId, memberId) => {
    e.stopPropagation();
    const data = {
      itineraryId: itineraryId,
      notificationId: notificationId,
      type: "REJECT",
      memberId: memberId,
    };
    axios
      .put("/api/itinerary/members", data)
      .then((response) => {
        if (response.data.success) {
          const responseData = response.data.notification;
          const updatedUnreadNotifications = unreadNotifications.filter(
            (notification) => notification._id !== responseData._id
          );
          setUnreadNotifications(updatedUnreadNotifications);
          console.log("hello", response.data.success);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };
  // useEffect(() => {
  //   dispatch(loadUser());
  // }, []);
  const logout = () => {
    axios
      .post("/logout")
      .then((response) => {
        dispatch({ type: "LOGOUT" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMessages = () => {
    history.push("/messenger");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/TravelFeed">
          <img className="logo" src={logo} alt="Logo" />
        </Link>
      </div>
      {/* <div className="navbar-center">
        <input type="text" placeholder="Search for Places, People or Tags" />
      </div> */}

      <div className="message flex items-center p-0">
        <div className="messenger-icon" onClick={() => setOpen(!open)}>
          <FontAwesomeIcon
            icon={faBell}
            size="lg"
            onClick={handleOpenNotificationMenu}
          />
          {unreadNotifications.length > 0 && (
            <div className="counter">{unreadNotifications.length}</div>
          )}
          <Menu
            sx={{ mt: "45px", maxHeight: "40%" }}
            id="menu-appbar"
            anchorEl={anchorNotification}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorNotification)}
            onClose={handleCloseNotificationMenu}
          >
            {notifications.map((notification) => (
              <List
                sx={{
                  width: "100%",
                  maxWidth: 400,
                  bgcolor: "background.paper",
                }}
              >
                <ListItem alignItems="flex-start">
                  <ListItemButton
                    onClick={() =>
                      notification.itineraryId
                        ? handleNotificationWithItinerary(
                            notification._id,
                            notification.itineraryId
                          )
                        : handleNotification(
                            notification._id,
                            notification.senderuserId
                          )
                    }
                  >
                    <ListItemText
                      primary={
                        <React.Fragment>{notification.message}</React.Fragment>
                      }
                    />

                    {notification.notificationType === "ITINERARY_REQUEST" ? (
                      <>
                        <div
                          className="acceptButton"
                          onClick={(e) =>
                            handleAcceptRequest(
                              e,
                              notification._id,
                              notification.itineraryId,
                              notification.senderuserId
                            )
                          }
                        >
                          Accept
                        </div>
                        <div
                          className="rejectButton"
                          onClick={(e) =>
                            handleRejectRequest(
                              e,
                              notification._id,
                              notification.itineraryId,
                              notification.senderuserId
                            )
                          }
                        >
                          {" "}
                          Reject
                        </div>
                      </>
                    ) : (
                      <ListItemIcon>
                        {notification.isRead ? (
                          <div></div>
                        ) : (
                          <Badge
                            color="primary"
                            sx={{ paddingLeft: 5 }}
                            badgeContent=" "
                            variant="dot"
                          />
                        )}
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                </ListItem>
                <Divider />
              </List>
            ))}
          </Menu>
        </div>

        <div className="messenger-icon" onClick={handleMessages}>
          <FontAwesomeIcon icon={faComments} size="lg" />
          {totalUnread > 0 && <div className="counter">{totalUnread}</div>}
        </div>

        <div className="relative">
          <img
            className="w-10 cursor-pointer rounded-full aspect-square"
            src={user.profilePhoto || profile}
            alt="Profile"
            onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div className="absolute top-[44px] shadow-md border bg-white -left-24">
              <ul>
                <li>
                  <Link
                    to="/profile"
                    className="p-2 hover:bg-gray-100 px-12 block"
                  >
                    Profile
                  </Link>
                </li>
                <li className="p-2 hover:bg-gray-100 px-12 block">Settings</li>
                <li
                  className="p-2 hover:bg-gray-100 px-12 block"
                  onClick={logout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
