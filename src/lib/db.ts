import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/data.db",
});

try {
    await sequelize.authenticate();
    console.log("DB is working");
} catch (error) {
    console.error("DB is not working", error);
}

export default sequelize;
