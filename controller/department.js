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
    const name = req.body.name
    try{
        const result = await Role.update(name,{where:{id:req.params.id}})
        res.json({responseCode:0,responseMessage:"Department updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update Department"})
    }
}
const getDepartments = async (req, res) => {
// select from department then loop through and query the category then loop and query the sub category
}

module.exports = {
    createDepartment,
    deleteDepartment,
    editDepartment,
    getDepartments
};