module.exports = (sequelize,DataTypes)=>{
    const Order = sequelize.define('order',
    {
        order_id:{
            type:DataTypes.STRING(150),
            allowNull:false,
            primaryKey:true
        },
        product_id:{
            type:DataTypes.STRING(150),
            allowNull:false
        },
        product_name:{
            type:DataTypes.STRING(150)
        },
        total_price:{
            type:DataTypes.DECIMAL(10,2)
        },
        shipping_fee:{
            type:DataTypes.DECIMAL(10,2)
        },
        package_id:{
            type:DataTypes.STRING(200)
        },
        tracking_number:{
            type:DataTypes.STRING(200)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Order;
}