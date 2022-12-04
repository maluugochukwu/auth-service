module.exports = (sequelize,DataTypes)=>{
    const MenuGroup = sequelize.define('menu_group',
    {
        menu_id:{
            type:DataTypes.STRING(5),
            allowNull:false,
            primaryKey:true
        },
        role_id:{
            type:DataTypes.STRING(100),
            primaryKey:true
        }
    },
    {
        freezeTableName:true
    }
    )
    return MenuGroup;
}