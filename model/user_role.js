module.exports = (sequelize,DataTypes)=>{
    const UserRole = sequelize.define('user_role',
    {
        username:{
            type:DataTypes.STRING(220),
            allowNull:false,
            primaryKey:true
        },
        role_id:{
            type:DataTypes.STRING(3),
            allowNull:false,
            primaryKey:true,
            references:{
                model: 'role',
                key: 'role_id'
            }
        }
    },
    {
        freezeTableName:true
    }
    )
    return UserRole;
}