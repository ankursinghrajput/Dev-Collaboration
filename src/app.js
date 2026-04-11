const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("../config/database");
const { validateSignup } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");


dotenv.config();
const app = express();

app.use(express.json());

app.post("/signup", validateSignup, async (req, res) => {
    const { name, email, password, age, gender } = req.body;
    if (!name || !email || !password || !age || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, age, gender });
    return res.status(201).json({ message: "User created successfully", user });
});

app.post("/login", validateLogin, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    return res.status(200).json({ message: "User logged in successfully", user });
});

app.get("/feed", async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ users });
});

app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully", user });
});

connectDb().then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});





