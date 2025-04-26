import { DataTypes } from "sequelize";
import sequelize from "../db";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { tableName: "users", timestamps: false },
);

export default User;
