const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DATABASE,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.DIALECT,
})

const db = {}
db.sequelize = sequelize;
const models = {}
models.User = require('./user')(sequelize,Sequelize.DataTypes);
models.Role = require('./role')(sequelize,Sequelize.DataTypes);
models.Product = require('./product')(sequelize,Sequelize.DataTypes);
models.ProductImage = require('./product_image')(sequelize,Sequelize.DataTypes);

module.exports = {db,models};
