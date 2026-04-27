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
        if (sender.toString() === receiver.toString()) {
            return res.status(400).json({ message: "You cannot send a request to yourself" });
        }
        // If request is sent by A to B, check if B has sent request to A
        const existingRequest = await ConnRequest.findOne({ $or: [{ sender, receiver }, { receiver, sender }] });
        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }
        //If user is not exists.
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



module.exports = requestRouter;