// Imports
import { DataTypes, Model } from 'sequelize';
import { sequelize } from "../config/database.js";
import argon2 from "argon2";

// User Model
class User extends Model {

};

User.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        username: { 
            type: DataTypes.STRING(20), 
            allowNull: false, 
            unique: true, 
            validate: {
                len: [3, 20],
                is: /^[a-z0-9_]+$/
            },
            set(value) {
                this.setDataValue("username", value.toLowerCase());
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            },
            set(value) {
                this.setDataValue("email", value.toLowerCase());
            }
        },

        club: { 
            type: DataTypes.STRING(10), 
            allowNull: false,
            validate: {
                len: [3, 12],
            }
        },

        role: { 
            type: DataTypes.ENUM("user", "admin"), defaultValue: "user"
        },

        password: { 
            type: DataTypes.STRING(255), 
            allowNull: false,
            validate: {
                len: [8, 32]
            }
        }
    },

    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,

        defaultScope: {
            attributes: { exclude: ["password"] }
        },

        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await argon2.hash(user.password);
                }
            },

            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    user.password = await argon2.hash(user.password);
                }
            }
        },
    }
);

export default User;