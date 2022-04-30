module.exports = (sequelize,DataTypes)=>{
    const Role = sequelize.define('role',
    {
        role_id:{
            type:DataTypes.STRING(3),
            allowNull:false,
            primaryKey:true
        },
        role_name:{
            type:DataTypes.STRING(100)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Role;
}