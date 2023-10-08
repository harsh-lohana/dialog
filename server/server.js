const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
// app.use(notFound);
app.use(errorHandler);

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
