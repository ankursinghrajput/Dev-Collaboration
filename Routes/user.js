const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

userRouter.get("/feed", userAuth, async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ users });
});

module.exports = userRouter;