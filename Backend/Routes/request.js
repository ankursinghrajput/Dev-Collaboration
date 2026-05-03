const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnRequest = require("../models/connRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
    try {
        const sender = req.user._id;
        const receiver = req.params.id;
        const status = req.params.status;

        // Validate status
        const allowedStatus = ["interested", "not_interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed: interested, not_interested" });
        }

        if (sender.toString() === receiver.toString()) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }
        // If request is sent by A to B, check if B has sent request to A
        const existingRequest = await ConnRequest.findOne({ $or: [{ sender, receiver }, { receiver, sender }] });
        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }
        //If user does not exist
        const existUser = await User.findById(receiver);
        if (!existUser) {
            return res.status(404).json({ message: "User not found" });
        }
        //create a request
        const request = await ConnRequest.create({ sender, receiver, status });
        return res.status(200).json({ message: "Request sent successfully", request });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

requestRouter.post("/request/review/:status/:id", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { status, id } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const connectionRequest = await ConnRequest.findOne({
            _id: id,
            receiver: loggedInUser,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection Request not found" });
        }

        if (status === "rejected") {
            await ConnRequest.findByIdAndDelete(connectionRequest._id);
        } else {
            connectionRequest.status = status;
            await connectionRequest.save();
        }

        return res.status(200).json({ message: "Connection request " + status, connectionRequest });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
})

// Unfollow / Disconnect from a user
requestRouter.delete("/request/unfollow/:userId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const targetUserId = req.params.userId;

        // Find the accepted connection between the two users
        const connection = await ConnRequest.findOne({
            $or: [
                { sender: loggedInUser, receiver: targetUserId, status: "accepted" },
                { sender: targetUserId, receiver: loggedInUser, status: "accepted" }
            ]
        });

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        await ConnRequest.findByIdAndDelete(connection._id);
        return res.status(200).json({ message: "Successfully unfollowed" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = requestRouter;