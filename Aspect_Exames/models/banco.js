import Sequelize from 'sequelize';

const db = new Sequelize("bd_aspect", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

export default db;