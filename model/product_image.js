module.exports = (sequelize,DataTypes)=>{
    const ProductImage = sequelize.define('product_image',
    {
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        src:{
            type:DataTypes.STRING(200)
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductImage;
}