import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://echoch.vercel.app",
    methods: ["GET", "POST"]
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
