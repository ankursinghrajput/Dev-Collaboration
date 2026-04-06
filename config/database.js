const mongoose = require("mongoose");
const connectDb = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected ", connect.connection.host, connect.connection.name);
}
module.exports = connectDb;
