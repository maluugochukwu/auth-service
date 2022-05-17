module.exports = (sequelize,DataTypes)=>{
    const Product = sequelize.define('product',
    {
        name:{
            type:DataTypes.STRING(150),
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT
        },
        weight:{
            type:DataTypes.INTEGER
        },
        category_id:{
            type:DataTypes.INTEGER
        },
        brand_id:{
            type:DataTypes.INTEGER
        },
        price:{
            type:DataTypes.DECIMAL(10,2)
        },
        img:{
            type:DataTypes.STRING(220)
        },
        has_variant:{
            type:DataTypes.CHAR(1)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Product;
}