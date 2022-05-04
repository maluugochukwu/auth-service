module.exports = (sequelize,DataTypes)=>{
    const ProductTag = sequelize.define('product_tag',
    {
       
        product_id:{
            type:DataTypes.STRING(150),
            allowNull:false
        },
        name:{
            type:DataTypes.STRING(150)
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductTag;
}