// Imports
import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/database.js";

// User Model
class Post extends Model {

};

Post.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },

        hometeam: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                len: [3, 10],
            }
        },

        awayteam: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                len: [3, 10],
            }
        },

        competition: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                len: [3, 10],
            }
        },

        status: { 
            type: DataTypes.STRING(), 
            allowNull: false,
        },

        mood: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
        },

        reaction: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [10, 300]
            }
        },

        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },

    {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        timestamps: true,
    }
);

export default Post;