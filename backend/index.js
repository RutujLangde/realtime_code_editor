import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import axios from "axios";
import connectDB from "./config/db.js";
import router from "./routers/authRouters.js";
// import cros from 'cros';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';


const app = express();
const server = http.createServer(app);



connectDB();

// app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*", // Allow any frontend to connect
        // methods: ["GET", "POST"]
    },
});



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // allow cookies and auth headers
}));


app.use(express.json()); // Built-in body parser
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/api/auth", router);

// app.use(checkForAuthenticationCookies('rutuj'));
// app.use(express.static(path.resolve('./public')))
// app.use(express.static(path.resolve('./public')));

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "public")));



const rooms = new Map();
const roomCode = new Map();

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", ({ roomId, userName }) => {
        console.log(`User ${userName} is trying to join room: ${roomId}`);

        if (!roomId || !userName) {
            // console.log("Invalid room ID or username.");
            return;
        }

        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
            // return;
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
        });

        socket.on("compileCode", async({code, roomId, language, version})=>{
            if(rooms.has(roomId)){
                const room = rooms.get(roomId);
                
                const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                    language,
                    version,
                    files: [
                        {
                            content: code
                        },
                    ],
                },
            );

                room.output = response.data.run.output;
                io.to(roomId).emit("codeResponse", response.data)
            }
        });

        socket.on("typing", ({roomId, userName}) =>{
            socket.to(roomId).emit("userTyping", userName);
        });

        

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
    console.log(`Server running at http://localhost:${port}`);
});

