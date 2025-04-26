"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    "users",
                    "admin",
                    { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false },
                    { transaction: t },
                ),
                queryInterface.createTable(
                    "settings",
                    {
                        id: {
                            type: Sequelize.DataTypes.INTEGER,
                            primaryKey: true,
                            autoIncrement: true,
                        },
                        mediaPath: {
                            type: Sequelize.DataTypes.STRING,
                            allowNull: false,
                        },
                    },
                    { transaction: t },
                ),
            ]);
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("users", "admin", {
                    transaction: t,
                }),
                queryInterface.dropTable("settings", { transaction: t }),
            ]);
        });
    },
};
