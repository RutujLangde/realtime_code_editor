import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect
        // methods: ["GET", "POST"]
    },
});

const rooms = new Map();
const roomCode = new Map();

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", ({ roomId, userName }) => {
        console.log(`User ${userName} is trying to join room: ${roomId}`);

        if (!roomId || !userName) {
            console.log("Invalid room ID or username.");
            return;
        }

        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        rooms.get(roomId).add(userName);

        // Send the latest code to the new user
        if (roomCode.has(roomId)) {
            socket.emit("codeUpdate", roomCode.get(roomId)); // Send latest code to the new user
        }

        io.to(roomId).emit("UserJoined", Array.from(rooms.get(roomId))); // Notify others

        socket.on("codeChange", ({ roomId, code }) => {
            roomCode.set(roomId, code); // Store latest code
            io.to(roomId).emit("codeUpdate", code); // Send it to everyone
        });

        socket.on("leaveRoom", () => {
            if (roomId && userName) {
                rooms.get(roomId).delete(userName);
                io.to(roomId).emit("UserJoined", Array.from(rooms.get(roomId)));
                socket.leave(roomId);
            }
        });

        socket.on("languageChangde", ({roomId, language}) => {
            io.to(roomId).emit("languageUpdate", language);
        })

        socket.on("typing", ({roomId, userName}) =>{
            socket.to(roomId).emit("userTyping", userName);
        })

        socket.on("disconnect", () => {
            if (roomId && userName) {
                rooms.get(roomId).delete(userName);
                io.to(roomId).emit("UserJoined", Array.from(rooms.get(roomId)));
            }
            console.log("User Disconnected");
        });
    });
});

const port = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

server.listen(port,  () => { // Allow external devices
    console.log(`Server running at http://192.168.1.100:${port}`);
});

