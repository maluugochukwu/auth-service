const { models: {Department,ProductCategory,ProductSubCategory} }  = require('../model');
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
        const result = await Department.update(name,{where:{id:req.params.id}})
        res.json({responseCode:0,responseMessage:"Department updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update Department"})
    }
}
const getDepartments = async (req, res) => {
// select from department then loop through and query the category then loop and query the sub category
    const dep = await Department.findAll()
    const mega = []
    
    
    if(dep.length > 0)
    {
        
        for(let element = 0; element < dep.length; element++) {
            var cat = []
                let d = await ProductCategory.findAll({
                    where:{
                        department_id:dep[element].id
                    }
                })
                for(let el = 0; el < d.length; el++){
                    const subcat = []
                    let subcatrecord = await ProductSubCategory.findAll({
                        where:{
                            category_id:d[el].id
                        }
                    })
                    for(let ex = 0; ex < subcatrecord.length; ex++)
                    {
                        subcat.push({
                            id:subcatrecord[ex].id,
                            name:subcatrecord[ex].name
                        })
                    }
                    cat.push({
                        id:d[el].id,
                        name:d[el].name,
                        subCategory:subcat
                    })
                }
            mega.push({
                    id:dep[element].id,
                    name:dep[element].name,
                    category:cat
                })
        }
        
    }
    console.log(JSON.stringify(mega));
    res.json({message:"done"})
}

module.exports = {
    createDepartment,
    deleteDepartment,
    editDepartment,
    getDepartments
};