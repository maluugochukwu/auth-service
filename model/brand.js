module.exports = (sequelize,DataTypes)=>{
    const Brand = sequelize.define('brand',
    {
        
        name:{
            type:DataTypes.STRING(100)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Brand;
}