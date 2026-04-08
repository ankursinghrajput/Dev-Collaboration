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

connectDb().then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});





