const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("../config/database");
const { validateSignup, validateLogin } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


dotenv.config();
const app = express();

app.use(express.json());

app.post("/signup", validateSignup, async (req, res) => {
    const { name, email, password, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, age, gender });
    return res.status(201).json({ message: "User created successfully" });
});

app.post("/login", validateLogin, async (req, res) => {
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
    return res.status(200).json({ message: "User logged in successfully", user, token });
});

app.get("/feed", userAuth, async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ users });
});

app.delete("/delete/:id", userAuth, async (req, res) => {
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





