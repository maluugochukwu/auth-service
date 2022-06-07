const Sequelize = require("sequelize");
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE,process.env.USER,process.env.PASSWORD,{
    host:process.env.HOST,
    dialect:process.env.DIALECT,
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
models.Showcase             = require('./showcase')(sequelize,Sequelize.DataTypes);
models.ProductShowcase      = require('./product_showcase')(sequelize,Sequelize.DataTypes);
models.ProductTag           = require('./product_tags')(sequelize,Sequelize.DataTypes);
models.Brand                = require('./brand')(sequelize,Sequelize.DataTypes);
models.AuthProvider         = require('./auth_provider')(sequelize,Sequelize.DataTypes);
models.UserAddress         = require('./user_address')(sequelize,Sequelize.DataTypes);
models.Transaction         = require('./transaction')(sequelize,Sequelize.DataTypes);



module.exports = {db,models};
