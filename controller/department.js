const { models: {Department} }  = require('../model');
const createDepartment = async (req,res)=>{
    const name = req.body.name
    const newArr = []
    
    
    try
    {
        const result = await Department.create({name})
        res.json({responseCode:0,responseMessage:"ok"})
    }catch(err) {
        res.json({responseCode:89,responseMessage:"Could not create department"})
    }
}
const deleteDepartment = async (req,res)=>{
    try{
        const count = await Department.destroy({ where: { id:req.params.department_id } });
        res.json({responseCode:0,responseMessage:`Department deleted`})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not delete department"})
    }
}
const editDepartment = async (req,res)=>{
    const validKeys = ["tagName"];
    for (var property in req.body) 
    {
        if(!validKeys.includes(property))
        {
            res.json({responseCode:91,responseMessage:`${property} is not a valid field`})
            return
        }
    }
    const newArr = {};
    if(req.body.tagName) newArr.tagname = req.body.tagName
    console.log(newArr)
    try{
        const result = await Role.update(newArr,{where:{tagname:req.body.tagName,product_id:req.params.id}})
        res.json({responseCode:0,responseMessage:"Tag updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update Tag"})
    }
}

module.exports = {
    createDepartment,
    deleteDepartment,
    editDepartment
};