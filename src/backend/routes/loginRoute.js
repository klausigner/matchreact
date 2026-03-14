// Imports
import express from 'express';
import User from "../models/User.js";
import { body, validationResult } from 'express-validator';
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Set up express router
const router = express.Router();

// GET login
router.get('/', (_, res) => {
    res.render("login", { error: '' });
});

// POST login
router.post("/", 
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('enter a valid email'),

        body('password')
            .notEmpty()
            .withMessage('password is required')
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('login', { error: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ 
                where: { email: email.toLowerCase() },
                attributes: ['id', 'username', 'email', 'password']
            });

            if (!user) return res.status(401).render('login', { error: 'user not found' });

            const isValidPassword = await argon2.verify(user.password, password);

            if (!isValidPassword) return res.status(401).render('login', { error: 'incorrect password' });

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                maxAge: process.env.JWT_MAX_AGE
            });

            return res.redirect("/dashboard");
        }

        catch (err) {
            return res.status(500).render('login', { error: 'something went wrong' });
        }
    }
);

export default router;