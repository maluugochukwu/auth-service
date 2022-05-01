module.exports = (sequelize,DataTypes)=>{
    const ProductSubCategory = sequelize.define('product_sub_category',
    {
        category_id:{
            type:DataTypes.STRING(100)
        },
        name:{
            type:DataTypes.STRING(150)
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductSubCategory;
}