import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  const { id } = socket;
  console.log("a user connected", id);

  io.emit("new-user", id);

  // When a user disconnects emit a message to all users
  socket.on("disconnect", () => {
    console.log("user disconnected", id);
    io.emit("user-disconnected", id);
  });
}); // 👈 Socket.IO 

httpServer.listen(4000, () => {
  console.log("listening on 4000");
});
