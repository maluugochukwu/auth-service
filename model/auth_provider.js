module.exports = (sequelize,DataTypes)=>{
    const AuthProvider = sequelize.define('auth_provider',
    {
        name:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
        secret:{
            type:DataTypes.TEXT
        },
        client_id:{
            type:DataTypes.TEXT
        }
    },
    {
        freezeTableName:true
    }
    )
    return AuthProvider;
}