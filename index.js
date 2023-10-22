import dotenv from "dotenv";
import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { username } = socket.handshake.query;
  const { id } = socket;
  console.log("a user connected", id);
  socket.emit("welcome", id);
  io.emit("enter-user", username);

  socket.on("new-message", (data) => {
    const newMessage = {
      message: data.message,
      repliedTo: data.replyTo,
      img: data.img,
      sender: {
        id,
        username
      }
    }
    console.log(newMessage)
    io.emit("new-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected", id);
    socket.broadcast.emit("leave-user", username);
  });
})

httpServer.listen(4000, () => {
  console.log("listening on 4000");
});
