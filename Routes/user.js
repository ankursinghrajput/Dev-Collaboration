const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const connRequest = require("../models/connRequest");

userRouter.get("/feed", userAuth, async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ users });
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const receivedRequests = await ConnRequest.find({
            receiver: loggedInUser,
            status: "interested"
        }).populate("sender", "name photoUrl");
        return res.status(200).json({ receivedRequests });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const connections = await ConnRequest.find({
            $or: [
                { sender: loggedInUser, status: "accepted" },
                { receiver: loggedInUser, status: "accepted" }
            ]
        }).populate("sender", "name photoUrl").populate("receiver", "name photoUrl");
        const data = connections.map((row) => row.sender);
        return res.status(200).json({ data });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = userRouter;