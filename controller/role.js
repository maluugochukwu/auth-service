const { models: {Role} }  = require('../model');
const createRole = async (req,res)=>{
    res.json({message:"Coming soon"})
}
const deleteRole = async (req,res)=>{
    try{
        const count = await Role.destroy({ where: { role_id:req.params.id } });
        res.json({responseCode:0,responseMessage:`${count} role deleted`})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not delete role"})
    }
}
const editRole = async (req,res)=>{
    const validKeys = ["roleName"];
    for (var property in req.body) 
    {
        if(!validKeys.includes(property))
        {
            res.json({responseCode:91,responseMessage:`${property} is not a valid field`})
            return
        }
    }
    const newArr = {};
    if(req.body.roleName) newArr.role_name = req.body.roleName
    console.log(newArr)
    try{
        const result = await Role.update(newArr,{where:{id:req.params.id}})
        res.json({responseCode:0,responseMessage:"Role updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update role"})
    }
}
const getAllRoles = async (req, res) => {
    const result = await Role.findAll();
    if(result)
    {
        res.json({responseCode:0,responseMessage:`${result.length} record found`,data:result})
    }else{
        res.json({responseCode:0,responseMessage:`No record found`,data:[]})
    }
}


module.exports = {
    createRole,
    deleteRole,
    editRole,
    getAllRoles
};