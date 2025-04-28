"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tokens", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.DataTypes.UUIDV4,
            },
            token: Sequelize.DataTypes.STRING,
            userId: {
                type: Sequelize.DataTypes.UUID,
                references: {
                    model: {
                        tableName: "users",
                    },
                    key: "id",
                },
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("tokens");
    },
};
