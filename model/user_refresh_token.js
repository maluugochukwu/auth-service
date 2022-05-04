module.exports = (sequelize,DataTypes)=>{
    const UserRefreshToken = sequelize.define('user_refresh_token',
    {
        username:{
            type:DataTypes.STRING(220),
            allowNull:false,
        },
        refresh_token:{
            type:DataTypes.TEXT,
            allowNull:false,
        }
    },
    {
        freezeTableName:true
    }
    )
    return UserRefreshToken;
}