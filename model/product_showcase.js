module.exports = (sequelize,DataTypes)=>{
    const ProductShowcase = sequelize.define('product_showcase',
    {
        showcase_id:{
            type:DataTypes.STRING(30),
            allowNull:false
        },
        product_id:{
            type:DataTypes.TEXT
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductShowcase;
}