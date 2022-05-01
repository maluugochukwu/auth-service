module.exports = (sequelize,DataTypes)=>{
    const ProductCategory = sequelize.define('product_category',
    {
        name:{
            type:DataTypes.STRING(150)
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductCategory;
}