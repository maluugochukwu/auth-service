const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DATABASE,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect:dbConfig.DIALECT,
    logging: false
})

const db                    = {}
db.sequelize                = sequelize;
const models                = {}
models.User                 = require('./user')(sequelize,Sequelize.DataTypes);
models.Role                 = require('./role')(sequelize,Sequelize.DataTypes);
models.UserRole             = require('./user_role')(sequelize,Sequelize.DataTypes);
models.UserRefreshToken     = require('./user_refresh_token')(sequelize,Sequelize.DataTypes);
models.Product              = require('./product')(sequelize,Sequelize.DataTypes);
models.ProductImage         = require('./product_image')(sequelize,Sequelize.DataTypes);
models.Option               = require('./option')(sequelize,Sequelize.DataTypes);
models.OptionsGroup         = require('./optionsgroup')(sequelize,Sequelize.DataTypes);
models.ProductOption        = require('./productoption')(sequelize,Sequelize.DataTypes);
models.ProductCategory      = require('./product_category')(sequelize,Sequelize.DataTypes);
models.ProductSubCategory   = require('./product_sub_category')(sequelize,Sequelize.DataTypes);
models.Order                = require('./order')(sequelize,Sequelize.DataTypes);

module.exports = {db,models};
