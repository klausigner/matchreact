// Packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "url";

// Database
import { sequelize } from "./src/backend/config/database.js";

// Models
import User from './src/backend/models/User.js';
import Post from './src/backend/models/Post.js';

// Routes
import homeRoute from "./src/backend/routes/homeRoute.js";
import loginRoute from "./src/backend/routes/loginRoute.js";
import signupRoute from "./src/backend/routes/signupRoute.js";
import dashboardRoute from "./src/backend/routes/dashboardRoute.js";
import logoutRoute from "./src/backend/routes/logoutRoute.js";
import likesRoute from "./src/backend/routes/likesRoute.js";
import deleteRoute from "./src/backend/routes/deleteRoute.js";

// Middleware
import { authenticate } from "./src/backend/middleware/auth.js";
import { redirectIfAuthenticated } from "./src/backend/middleware/redirectIfAuth.js";

// Set up express and other middleware
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from public
app.use(express.static(path.join(__dirname, "src/frontend/public")));

// Activate ejs
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src/frontend/views"));

// Activate .env
dotenv.config();
const SRV_PORT = process.env.SRV_PORT;
const SRV_HOSTNAME = process.env.SRV_HOSTNAME;

// Connect and sync table
(async () => { 
    try {  
        // Test connection to aiven 
        await sequelize.authenticate();  

        // Define associations
        User.hasMany(Post, { foreignKey: 'userId' });
        Post.belongsTo(User, { foreignKey: 'userId' });

        // Create users table if it doesn't exist  
        await sequelize.sync();

        // Server launch
        app.listen(SRV_PORT, SRV_HOSTNAME, () => {
            console.log(`Listening for requests on http://${SRV_HOSTNAME}:${SRV_PORT}`);
        });
    }

    catch (err) {  
        console.error("Database error:", err);
    }
})();

// Home route
app.use("/", homeRoute);

// Login route
app.use("/login", redirectIfAuthenticated, loginRoute);

// Signup route
app.use("/signup", redirectIfAuthenticated, signupRoute);

// Dashboard route
app.use("/dashboard", authenticate, dashboardRoute);

// Likes route
app.use("/likes", likesRoute);

// Delete route
app.use("/delete", deleteRoute);

// Logout route
app.use("/logout", logoutRoute);

