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

module.exports = { validateSignup };