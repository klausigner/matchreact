// Imports
import express from 'express';

// Set up express router
const router = express.Router();

// GET home
router.get('/', (_, res) => {
    return res.redirect("login");
});

export default router;