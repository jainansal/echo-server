import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const { username } = socket.handshake.query;
  const { id } = socket;
  console.log("a user connected", id);
  socket.emit("welcome", id);
  io.emit("enter-user", username);

  socket.on("new-message", (message) => {
    const data = {
      message,
      sender: {
        id,
        username
      }
    }
    io.emit("new-message", data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected", id);
    socket.broadcast.emit("leave-user", username);
  });
})

httpServer.listen(4000, () => {
  console.log("listening on 4000");
});
