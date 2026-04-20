const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        // 1. Read the token from the Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find the user from the decoded ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }

        // 4. Attach the user object to the request so route handlers can use it
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired. Please log in again." });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { userAuth };
