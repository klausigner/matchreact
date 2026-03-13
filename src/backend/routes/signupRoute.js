// Imports
import express from 'express';
import User from "../models/User.js";
import { body, validationResult } from 'express-validator';

// Set up express router
const router = express.Router();

// GET signup
router.get('/', (_, res) => {
    res.render("signup");
});

// POST signup
router.post("/", 
    [
        body("username")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Username must be between 3 and 20 characters")
            .matches(/^[a-z0-9_]+$/)
            .withMessage("Username can only contain lowercase letters, numbers, and underscores"),

        body("club")
            .trim()
            .notEmpty()
            .withMessage("Favorite club is required")
            .isLength({ min: 3, max: 10 })
            .withMessage("Favorite club must be between 3 and 10"),

        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body("password")
            .isLength({ min: 8, max: 32 })
            .withMessage("Password must be within 8-32 characters")
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("signup", { error: "1 or more incorrect field(s)" });
        };

        let { username, email, club, password } = req.body;

        username = username.toLowerCase().replace(/\s+/g, '');
        email = email.toLowerCase();
        club = club.toLowerCase().replace(/\s+/g, '');

        try {
            await User.create({
                username,
                email,
                club,
                password
            });

            return res.redirect("/dashboard");
        }

        catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).render("signup", { 
                    error: "Email or username already exists"
                });
            }

            return res.status(500).render("signup", { error: "Something went wrong" });
        }
    }
);

export default router;