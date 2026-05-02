const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnRequest = require("../models/connRequest");

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
                { receiver: loggedInUser, status: "accepted" },
                { sender: loggedInUser, status: "interested" }
            ]
        }).populate("sender", "name photoUrl age gender about skills").populate("receiver", "name photoUrl age gender about skills");
        const data = connections.map((row) => {
            if (row.sender._id.toString() === loggedInUser.toString()) {
                return row.receiver;
            }
            return row.sender;
        });
        return res.status(200).json({ data });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50);
        const skip = (page - 1) * limit;
        const loggedInUser = req.user._id;
        const connectionRequest = await ConnRequest.find({
            $or: [{ sender: loggedInUser }, { receiver: loggedInUser }],
        }).select("sender receiver");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.sender.toString());
            hideUsersFromFeed.add(req.receiver.toString());
        });

        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser } },
            ]
        }).select("name photoUrl age gender about skills").skip(skip).limit(limit).sort({ createdAt: -1 });
        return res.status(200).json({ feedUsers });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = userRouter;