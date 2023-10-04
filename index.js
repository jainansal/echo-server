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
  io.emit("enter-user", id);

  socket.on("disconnect", () => {
    console.log("a user disconnected", id);
    socket.broadcast.emit("leave-user", id);
  });
})

httpServer.listen(4000, () => {
  console.log("listening on 4000");
});
