const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const accessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not sent!");
    return res.status(400);
  }
  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      name: "sender",
      isGroup: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const getChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name dp email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields!" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required!!" });
  }
  users.push(req.user);
  try {
    const group = await Chat.create({
      name: req.body.name,
      users: users,
      isGroup: true,
      admin: req.user,
    });
    const fullGroup = await Chat.findOne({ _id: group._id })
      .populate("users", "-password")
      .populate("admin", "-password");
    res.status(200).send(fullGroup);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const updatedGroup = await Chat.findByIdAndUpdate(
    req.body.chatId,
    { name: req.body.chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("admin", "-password");
  if (!updatedGroup) {
    res.status(400);
    throw new Error("Chat not found!");
  } else {
    res.status(200).send(updatedGroup);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const updatedGroup = await Chat.findByIdAndUpdate(
    req.body.chatId,
    {
      $push: { users: req.body.userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("admin", "-password");
  if (!updatedGroup) {
    res.status(400);
    throw new Error("Chat not found!");
  } else {
    res.status(200).send(updatedGroup);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const updatedGroup = await Chat.findByIdAndUpdate(
    req.body.chatId,
    {
      $pull: { users: req.body.userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("admin", "-password");
  if (!updatedGroup) {
    res.status(400);
    throw new Error("Chat not found!");
  } else {
    res.status(200).send(updatedGroup);
  }
});

module.exports = {
  accessChats,
  getChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
