module.exports = (sequelize,DataTypes)=>{
    const OptionsGroup = sequelize.define('options_group',
    {
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        freezeTableName:true
    }
    )
    return OptionsGroup;
}