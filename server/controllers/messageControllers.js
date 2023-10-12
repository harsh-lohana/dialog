const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const user = req.user;
  if (!content || !chatId) {
    console.log("Invalid data!");
    return res.status(400);
  }
  let message = {
    sender: user._id,
    content: content,
    chat: chatId,
  };
  try {
    let newMessage = await Message.create(message);
    newMessage = await newMessage.populate("sender", "name dp ");
    newMessage = await newMessage.populate("chat");
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage,
    });
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "name dp email",
    });
    return res.status(200).json(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name dp email")
      .populate("chat");
    return res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getMessages };
