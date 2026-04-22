const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/", userAuth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ message: "User profile", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

profileRouter.delete("/delete/:id", userAuth, async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully", user });
});

module.exports = profileRouter;