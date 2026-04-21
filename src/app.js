const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("../config/database");
const authRouter = require("../Routes/auth");
const profileRouter = require("../Routes/profile");
const userRouter = require("../Routes/user");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);

connectDb().then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});





