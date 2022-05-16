module.exports = (sequelize,DataTypes)=>{
    const ProductTag = sequelize.define('product_tag',
    {
       
        product_id:{
            type:DataTypes.STRING(150),
            allowNull:false
        },
        tag_id:{
            type:DataTypes.STRING(30)
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductTag;
}