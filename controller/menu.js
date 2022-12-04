const { models: {Menu} }  = require('../model');
const addMenu = async (req,res)=>{
   
    const {menuName,menuUrl,parentId,icon} = req.body
    const dbData = {menu_name:menuName,menu_url:menuUrl,parent_id:parentId,icon}
    try{
        const result = await Menu.create(dbData)
        res.status(200).json({success:true,message:"Menu saved"})
    }
    catch(err)
    {
        res.status(401).json({errors:[{code:27,message:"Could not save Menu"}]})
    }
    

}
const editMenu = async (req,res)=>{
   

}
const getMenu = async (req,res)=>{
   

}


module.exports = {
    addMenu,
    editMenu,
    getMenu
};