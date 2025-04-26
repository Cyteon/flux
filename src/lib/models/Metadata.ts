import { DataTypes } from "sequelize";
import sequelize from "../db";

export const Metadata = sequelize.define(
    "Metadata",
    {
        id: {
            // IMDB ID
            type: DataTypes.STRING,
            primaryKey: true,
        },
        filePath: {
            type: DataTypes.STRING,
            unique: true,
        },
        title: DataTypes.STRING,
        year: DataTypes.STRING,
        released: DataTypes.STRING,
        runtime: DataTypes.STRING,
        genre: DataTypes.STRING,
        director: DataTypes.STRING,
        writer: DataTypes.STRING,
        actors: DataTypes.STRING,
        plot: DataTypes.STRING,
        awards: DataTypes.STRING,
        poster: DataTypes.STRING,
        ratings: DataTypes.JSON,
    },
    { tableName: "metadata", timestamps: true },
);

export default Metadata;
