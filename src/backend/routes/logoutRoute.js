// Imports
import express from 'express';

// Set up express router
const router = express.Router();

// GET logout
router.get("/", (_, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        path: "/"
    });

    res.redirect("/login");
});

export default router;