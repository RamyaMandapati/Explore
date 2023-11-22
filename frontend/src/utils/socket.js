import { io } from "socket.io-client";

// Create and export a single socket instance
const SOCKET_URL = "http://localhost:5001";
const socket = io(SOCKET_URL);

export default socket;
