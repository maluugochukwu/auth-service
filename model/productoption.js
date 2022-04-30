module.exports = (sequelize,DataTypes)=>{
    const ProductOption = sequelize.define('product_option',
    {
        product_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        options_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        options_group_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        charge:{
            type:DataTypes.STRING(30),
        }
    },
    {
        freezeTableName:true
    }
    )
    return ProductOption;
}