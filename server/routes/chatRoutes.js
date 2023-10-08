const express = require("express");
const { accessChats, getChats } = require("../controllers/chatControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChats).get(protect, getChats);
// router.route("/group").post(protect, createGroup);
// router.route("/rename").put(protect, renameGroup);
// router.route("/add").put(protect, addToGroup);
// router.route("/remove").put(protect, removeFromGroup);

module.exports = router;
