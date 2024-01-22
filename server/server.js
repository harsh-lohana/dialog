const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const { Socket } = require("socket.io");
const path = require("path");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
// app.use(notFound);
app.use(errorHandler);

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ---------- depolyment ----------

const __currdir = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__currdir, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__currdir, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running!");
  });
}

// ---------- depolyment ----------

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined!");
    else {
      for(let i = 0; i < chat.users.length; i++) {
        if (chat.users[i]._id === newMessageReceived.sender._id) return;
        socket.in(chat.users[i]._id).emit("message received", newMessageReceived);
      }
    }
  });
  socket.off("setup", () => {
    console.log("User Disconnected!");
    socket.leave(userData._id);
  });
});
