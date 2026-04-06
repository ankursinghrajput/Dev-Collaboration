const express = require("express");
const dontenv = require("dotenv");
const connectDb = require("../config/database");
dontenv.config();
const app = express();

connectDb().then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});





