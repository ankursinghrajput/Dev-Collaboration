const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const connectDb = require("../config/database");
const authRouter = require("../Routes/auth");
const profileRouter = require("../Routes/profile");
const userRouter = require("../Routes/user");
const requestRouter = require("../Routes/request");

const passport = require("../config/passport");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

connectDb().then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});





