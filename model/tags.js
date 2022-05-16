module.exports = (sequelize,DataTypes)=>{
    const Tag = sequelize.define('tag',
    {
        name:{
            type:DataTypes.STRING(150)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Tag;
}