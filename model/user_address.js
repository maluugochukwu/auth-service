module.exports = (sequelize,DataTypes)=>{
    const UserAddress = sequelize.define('user_address',
    {
        username:{
            type:DataTypes.STRING(220),
            allowNull:false
        },
        address:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        state:{
            type:DataTypes.STRING(15),
            allowNull:false
        },
        town:{
            type:DataTypes.STRING(15),
            allowNull:false
        },
        lga:{
            type:DataTypes.STRING(15),
            allowNull:false
        },
        is_primary:{
            type:DataTypes.CHAR(1),
            allowNull:false
        }
    },
    {
        freezeTableName:true
    }
    )
    return UserAddress;
}