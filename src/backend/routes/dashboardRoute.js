// Imports
import express from 'express';
import { col } from "sequelize";
import Post from './../models/Post.js';
import User from './../models/User.js';

// Set up express router
const router = express.Router();

// GET dashboard
router.get('/', async (req, res) => {
    const posts = await Post.findAll({ 
        attributes: [
            "id", 
            "hometeam", 
            "awayteam", 
            "competition", 
            "status", 
            "mood", 
            "reaction",
            "likes",
            "createdAt",
            [col("User.username"), "username"],
            [col("User.club"), "club"]
        ],

        order: [["id", "DESC"]],

        include: {
            model: User,
            attributes: []
        },

        raw: true,
    });


    const userInfo = await User.findByPk(req.user.id);
    const { id, username: loggedInUsername, role } = userInfo.dataValues;
    const currentUser = { id, username: loggedInUsername, role };

    return res.render("dashboard", { posts, currentUser });
});

// POST dashboard
router.post("/", async (req, res) => {
    let {
        hometeam,
        awayteam,
        competition,
        status,
        mood,
        reaction,
        username = req.user.username,
        userId = req.user.id
    } = req.body;

    hometeam = hometeam.replace(/\s+/g, '');
    awayteam = awayteam.replace(/\s+/g, '');
    competition = competition.replace(/\s+/g, '');
    reaction = reaction.trim();

    try {
        await Post.create({
            hometeam,
            awayteam,
            competition,
            status,
            mood,
            reaction,
            username,
            userId
        });

        const posts = await Post.findAll({ 
            attributes: [
                "id", 
                "hometeam", 
                "awayteam", 
                "competition", 
                "status", 
                "mood", 
                "reaction",
                "likes",
                "createdAt",
                [col("User.username"), "username"],
                [col("User.club"), "club"]
            ],

            order: [["id", "DESC"]],

            include: {
                model: User,
                attributes: []
            },

            raw: true,
        });

        const userInfo = await User.findByPk(req.user.id);
        const { id, username: loggedInUsername, role } = userInfo.dataValues;
        const currentUser = { id, username: loggedInUsername, role };

        return res.render("dashboard", { posts, currentUser });
    }

    catch (err) {
        const posts = await Post.findAll({ 
            attributes: [
                "id", 
                "hometeam", 
                "awayteam", 
                "competition", 
                "status", 
                "mood", 
                "reaction",
                "likes",
                "createdAt",
                [col("User.username"), "username"],
                [col("User.club"), "club"]
            ],

            order: [["id", "DESC"]],

            include: {
                model: User,
                attributes: []
            },

            raw: true,
        });

        const userInfo = await User.findByPk(req.user.id);
        const { id, username: loggedInUsername, role } = userInfo.dataValues;
        const currentUser = { id, username: loggedInUsername, role };

        console.log(err)

        return res.status(500).render("dashboard", { 
            error: "Post upload failure",
            posts, 
            currentUser
        });
    }
});

router.get("/admin", async (req, res) => {
    const posts = await Post.findAll({ 
        attributes: [
            "id", 
            "hometeam", 
            "awayteam", 
            "competition", 
            "status", 
            "mood", 
            "reaction",
            "likes",
            "createdAt",
            [col("User.username"), "username"],
            [col("User.club"), "club"]
        ],

        order: [["id", "DESC"]],

        include: {
            model: User,
            attributes: []
        },

        raw: true,
    });

    const userInfo = await User.findByPk(req.user.id);
    const { id, username: loggedInUsername, role } = userInfo.dataValues;
    const currentUser = { id, username: loggedInUsername, role };

    return res.render("admin", { posts, currentUser });
})

export default router;