// Imports
import express from 'express';
import { col } from "sequelize";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Set up express router
const router = express.Router();

// POST delete/:id
router.post("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);
        if (!post) return res.render("dashboard", { error: "Post not found" });

        await Post.destroy({
            where: { id: id }
        });

        return res.redirect("/dashboard/admin");
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
        const { id, username, role } = userInfo.dataValues;
        const currentUser = { id, username, role };

        res.status(500).render("admin", { error: "Failed to delete post", posts, currentUser });
    }
});

export default router;