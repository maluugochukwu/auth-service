module.exports = (sequelize,DataTypes)=>{
    const Menu = sequelize.define('menu',
    {
        menu_id:{
            type:DataTypes.INTEGER(9),
            allowNull:false,
            autoIncrement: true,
            primaryKey:true
        },
        menu_name:{
            type:DataTypes.STRING(100)
        },
        menu_url:{
            type:DataTypes.STRING(60)
        },
        parent_id:{
            type:DataTypes.STRING(5)
        },
        icon:{
            type:DataTypes.STRING(60)
        }
    },
    {
        freezeTableName:true
    }
    )
    return Menu;
}