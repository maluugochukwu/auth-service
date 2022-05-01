module.exports = (sequelize,DataTypes)=>{
    const UserRole = sequelize.define('user_role',
    {
        username:{
            type:DataTypes.STRING(220),
            allowNull:false,
        },
        role_id:{
            type:DataTypes.STRING(3),
            allowNull:false,
        }
    },
    {
        freezeTableName:true
    }
    )
    return UserRole;
}