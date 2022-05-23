module.exports = (sequelize,DataTypes)=>{
    const User = sequelize.define('user',
    {
        username:{
            type:DataTypes.STRING(200),
            unique:true,
            allowNull:false,
            primaryKey:true
        },
        email:{
            type:DataTypes.STRING(200),
            allowNull:false,
            validate:{
                isEmail: true,
            }
        },
        password:{
            type:DataTypes.TEXT
        },
        firstname:{
            type:DataTypes.STRING(200)
        },
        lastname:{
            type:DataTypes.STRING(200)
        },
        provider_id:{
            type:DataTypes.INTEGER(11),
            defaultValue:0
        },
        profile_photo:{
            type:DataTypes.TEXT
        },
    },
    {
        freezeTableName:true
    }
    )
    return User;
}