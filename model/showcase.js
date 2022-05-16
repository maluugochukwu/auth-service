module.exports = (sequelize,DataTypes)=>{
    const Showcase = sequelize.define('showcase',
    {
        name:{
            type:DataTypes.STRING(150),
            allowNull:false
        },
        time_bound:{
            type:DataTypes.TINYINT
        }
    },
    {
        freezeTableName:true
    }
    )
    return Showcase;
}