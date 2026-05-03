const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, validate(value) { if (!validator.isEmail(value)) { throw new Error("Invalid email address"); } } },
    password: { type: String, required: true, validate(value) { if (!validator.isStrongPassword(value)) { throw new Error("Password must be strong"); } } },
    age: { type: Number, min: 18 },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    photoUrl: {
        type: String,
        default: '',
        validate(value) {
            if (value && value.length > 0 && !validator.isURL(value, { require_protocol: true })) {
                throw new Error("Invalid photo URL. Must start with http:// or https://");
            }
        }
    },
    about: { type: String, default: "This is a default about of the user" },
    skills: [String],
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);