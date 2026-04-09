const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, min: 18 },
    gender: {
        type: String, validate(value) {
            if (value !== "male" && value !== "female" && value !== "other") {
                throw new Error("Gender must be male, female or other");
            }
        }
    },
    photoUrl: String,
    about: { type: String, default: "This is a default about of the user" },
    skills: [String],
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);