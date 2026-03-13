// Imports
import jwt from "jsonwebtoken";

// Middleware to redirect if already logged in
export const redirectIfAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return next();

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.redirect("/dashboard");
    }

    catch (err) {
        return next();
    }
};