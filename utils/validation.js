const validator = require("validator");

const validateSignup = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be strong" });
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    next();
}

const validateEditProfile = (req) => {
    const allowedFields = ["name", "age", "gender", "photoUrl", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
    return isEditAllowed;
}

module.exports = { validateSignup, validateLogin, validateEditProfile };