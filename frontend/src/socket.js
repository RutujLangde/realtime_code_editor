// socket.js
import { io } from "socket.io-client";

const socket = io("https://realtime-code-editor-ydpw.onrender.com/", { transports: ["websocket"] });

export default socket;
