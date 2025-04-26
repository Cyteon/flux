import { DataTypes } from "sequelize";
import sequelize from "../db";

import User from "./User";

const Token = sequelize.define(
    "Token",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        token: DataTypes.STRING,
        userId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    { tableName: "tokens", timestamps: false },
);

export default Token;
