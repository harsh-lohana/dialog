const express = require("express");
const {
  registerUser,
  authUser,
  getUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, getUsers);
router.route("/login").post(authUser);

module.exports = router;
