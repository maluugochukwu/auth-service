module.exports = (sequelize,DataTypes)=>{
    const Option = sequelize.define('option',
    {
        options_group_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING(150),
        }
    },
    {
        freezeTableName:true
    }
    )
    return Option;
}