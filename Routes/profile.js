const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfile } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

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

profileRouter.patch("/edit", userAuth, async (req, res) => {
    const { isEditAllowed } = validateEditProfile(req);
    if (!isEditAllowed) {
        return res.status(400).json({ message: "Invalid fields" });
    }
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    return res.status(200).json({ message: "User updated successfully", user });
})

profileRouter.patch("/password", userAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }
    if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({ message: "Password must be strong (min 8 chars, uppercase, lowercase, number, symbol)" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully", user });
})
module.exports = profileRouter;