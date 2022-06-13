module.exports = (sequelize,DataTypes)=>{
    const Department = sequelize.define('department',
    {
        
        name:{
            type:DataTypes.STRING(100)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Department;
}