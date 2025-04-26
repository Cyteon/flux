import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Settings = sequelize.define(
    "Settings",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        mediaPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { tableName: "settings", timestamps: false },
);

export default Settings;
