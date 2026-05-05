const express = require("express");
const authRouter = express.Router();
const { validateSignup, validateLogin } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", validateSignup, async (req, res) => {
    const { name, email, password, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, age, gender });
    return res.status(201).json({ message: "User created successfully" });
});

authRouter.post("/login", validateLogin, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ message: "User logged in successfully!" });
});

const passport = require('passport');

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.status(200).json({ message: "User logged out successfully" });
});

// OAuth Routes
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect('http://localhost:5173/feed');
});

authRouter.get('/auth/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

authRouter.get('/auth/github/callback', passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:5173/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect('http://localhost:5173/feed');
});

module.exports = authRouter;
