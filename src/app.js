const express = require("express");
const dontenv = require("dotenv");
const connectDb = require("../config/database");
dontenv.config();
const app = express();

app.post("/signup", async (req, res) => {
    const { name, email, password, age, gender } = req.body;
    if (!name || !email || !password || !age || !gender) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.create({ name, email, password, age, gender });
    return res.status(201).json({ message: "User created successfully", user });
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





