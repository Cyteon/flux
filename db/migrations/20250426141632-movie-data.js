"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("metadata", {
            id: {
                // IMDB ID
                type: Sequelize.DataTypes.STRING,
                primaryKey: true,
            },
            filePath: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            title: Sequelize.DataTypes.STRING,
            year: Sequelize.DataTypes.STRING,
            released: Sequelize.DataTypes.STRING,
            runtime: Sequelize.DataTypes.STRING,
            genre: Sequelize.DataTypes.STRING,
            director: Sequelize.DataTypes.STRING,
            writer: Sequelize.DataTypes.STRING,
            actors: Sequelize.DataTypes.STRING,
            plot: Sequelize.DataTypes.STRING,
            awards: Sequelize.DataTypes.STRING,
            poster: Sequelize.DataTypes.STRING,
            ratings: Sequelize.DataTypes.JSON,

            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("metadata");
    },
};
