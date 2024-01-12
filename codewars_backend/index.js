require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 5000;
const Room = require("./models/Room");
const { Easy } = require("./models/Problem");
const { Medium } = require("./models/Problem");
const { Hard } = require("./models/Problem");
const User = require("./models/User");
const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
mongoose.connect(process.env.MONGO_DB_URI);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  transports: ["websocket","polling"],
  cors: {
    origin: ["https://code-wars-1.vercel.app", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    transport: ["websocket","polling"],
  },
});
const users = {};
const readyUser = {};
let startTime;
const time = { easy: 3, medium: 30, hard: 45 };
app.get("/", (req, res) => {
  res.send("Hello");
});
app.post("/create-room", async (req, res) => {
  try {
    const { category } = req.body;
    const roomid = uuidv4();
    const newRoom = await Room.create({
      roomId: roomid,
      category: category,
      problems: [1, 2],
    });
    res.json(newRoom);
  } catch (err) {
    console.log("Room error=> ", err);
  }
});
app.post("/create-user", async (req, res) => {
  const { userId, name } = req.body;
  console.log(userId, name);
  try {
    const user = await User.findOne({ userId: userId });
    console.log(user);
    if (!user) {
      const newUser = await User.create({
        userId: userId,
        name: name,
        score: 0,
      });
      res.send(newUser);
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/get-room", async (req, res) => {
  const roomId = req.query.roomId;
  const room = await Room.findOne({ roomId: roomId });
  res.send(room);
});

app.post("/get-problems", async (req, res) => {
  const { id } = req.body;
  const { category } = req.body;
  try {
    let problems;
    if (category === "easy") problems = await Easy.find({ id: id });
    else if (category === "medium") problems = await Medium.find({ id: id });
    else problems = await Hard.find({ id: id });
    res.send(problems);
  } catch (err) {
    console.log(err);
  }
});

app.post("/add-score", async (req, res) => {
  const { userId, selectedProblem } = req.body;
  const user = await User.findOne({ userId: userId });
  user.score = user.score + (10 + selectedProblem * 10);
  user.save();
});

app.get("/get-users", async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ id, userName, userid }) => {
    users[userid] = { socketid: socket.id, userName: userName };
    socket.join(id);
    console.log(`User ${userName} joined room ${id}`);
    const message = {
      userId: 1,
      text: `${userName} joined the room 🔥`,
      timestamp: new Date().toISOString(),
    };
    io.to(id).emit("chat-message", message);
    io.to(id).emit(
      "active-users",
      Object.values(users).map((user) => ({ userName: user.userName }))
    );
  });
  socket.on("send-chat-message", (message) => {
    io.emit("chat-message", message);
  });
  socket.on("user-ready", ({ userId, roomId, category }) => {
    if (!readyUser[roomId]) readyUser[roomId] = new Set();
    readyUser[roomId].add(userId);
    console.log(readyUser);
    if (readyUser[roomId].size <= 2) {
      startTime = Date.now();
      const remainingTime = time[category] * 60;
      if (readyUser[roomId].size === 1) {
        socket.emit("timer", { timer: remainingTime, timerStarted: 0 });
      } else
        io.to(roomId).emit("timer", { timer: remainingTime, timerStarted: 1 });
    } else {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = time[category] * 60 - elapsedTime;
      socket.emit("timer", { timer: remainingTime, timerStarted1: 1 });
    }
    io.to(roomId).emit("chat-message", {
      userId: 1,
      text: `${users[userId].userName} is ready ⚔️`,
    });
  });
  socket.on("disconnect", () => {
    const userName = Object.keys(users).find(
      (key) => users[key].socketid === socket.id
    );
    if (userName) {
      console.log(`User ${userName} left`);
      delete users[userName];
    }
  });
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
