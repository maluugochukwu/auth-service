const { models: {Menu,MenuGroup}, db }  = require('../model');
const user_role = require('../model/user_role');
const addMenu = async (req,res)=>{
   
    const {menuName,menuUrl,parentId,icon} = req.body
    const username = res.locals.payload.username
    const dbData = {menu_name:menuName,menu_url:menuUrl,parent_id:parentId,icon,posted_user:username}
    try{
        const result = await Menu.create(dbData)
        res.status(200).json({success:true,message:"Menu saved"})
    }
    catch(err)
    {
        res.status(401).json({errors:[{code:27,message:"Could not save Menu"}]})
    }
}
const getParentMenus = async (req,res)=>
{
    try{
        const result = await Menu.findAll({where:{parent_id:"#"}})
        res.status(200).json({success:true,message:result})
    }
    catch(err)
    {
        res.status(401).json({errors:[{code:27,message:"No parent menu available"}]})
    }
}
const editMenu = async (req,res)=>{
    const username = res.locals.payload.username
    const {menuName,menuUrl,parentId,icon} = req.body
    const menu_id = req.params.menu_id
    const dbData = {menu_name:menuName,menu_url:menuUrl,parent_id:parentId,icon,posted_user:username}
    try{
        const result = await Menu.update(dbData,{where:{menu_id}})
        res.status(200).json({success:true,message:"Menu Edited"})
    }
    catch(err)
    {
        res.status(401).json({errors:[{code:27,message:"Could not edit Menu"}]})
    }
    
}
const getMenu = async (req,res)=>{
   

}
const getUserMenu = async (req,res)=>{
    var subMenu = []
    const output = []
    const user_role = res.locals.payload.role
    let role_id = ""
    user_role.map((d)=>{
        role_id += `'${d.id}',`
    })
    role_id = role_id.substring(0,role_id.length-1)
    const [results, metadata] = await db.sequelize.query(`select * from menu where  menu_id in (select menu_id from menu_group where role_id IN (${role_id}) ) order by menu_id asc`);
    console.log(results,"hiiii")
    if(results.length > 0)
    {
        for(let x = 0; x < results.length; x++)
        {
            let menu_id = results[x].menu_id
            let parent_id = results[x].parent_id
            let icon = results[x].icon
            let menu_url = results[x].menu_url
            let menu_name = results[x].menu_name
            const [results2, metadata2] = await db.sequelize.query(`select * from menu where parent_id = '${menu_id}' and menu_id in (select menu_id from menu_group where role_id IN (${role_id}) ) order by menu_id`);
            let hasSubMenu = false;
            if(results2.length > 0)
            {
                hasSubMenu = true;
                for(let px = 0; px < results2.length; px++)
                {
                    let menu_id2 = results2[px].menu_id
                    let menu_url2 = results2[px].menu_url
                    let menu_name2 = results2[px].menu_name
                    subMenu.push({menu_id:menu_id2,menu_url:menu_url2,name:menu_name2})
                }
            }
            output.push({
                menu_id,
                menu_name,
                parent_id,
                icon,
                menu_url,
                subMenu
            })
            subMenu = []
        }
    }

    res.json({responseCode:0,responseMessage:"OK",data:{Menu:output}});
}


module.exports = {
    addMenu,
    editMenu,
    getMenu,
    getUserMenu,
    getParentMenus
};