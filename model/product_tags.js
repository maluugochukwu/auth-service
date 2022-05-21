module.exports = (sequelize,DataTypes)=>{
    const ProductTag = sequelize.define('product_tag',
    {
        tagname:{
            type:DataTypes.STRING(150),
            primaryKey:true
        },
        product_id:{
            type:DataTypes.INTEGER(11),
            primaryKey:true
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductTag;
}