const { models: {Department,ProductCategory,ProductSubCategory} }  = require('../model');
const createDepartment = async (req,res)=>{
    const name = req.body.name
    const newArr = []
    
    
    try
    {
        const result = await Department.create({name})
        res.status(201).json({success:true,message:"Department created"})
    }catch(err) {
        res.status(401).json({errors:[{code:89,message:"Could not create department"}]})
    }
}
const deleteDepartment = async (req,res)=>{
    try{
        const count = await Department.destroy({ where: { id:req.params.department_id } });
        res.status(200).json({success:true,message:"Department deleted"})
    }catch(er)
    {
        res.status(401).json({errors:[{code:11,message:"Could not delete department"}]})
        
    }
}
const editDepartment = async (req,res)=>{
    const name = req.body.name
    try{
        const result = await Department.update(name,{where:{id:req.params.id}})
        res.status(200).json({success:true,message:"Department updated"})
    }catch(er)
    {
        res.status(401).json({errors:[{code:60,message:"Could not update department"}]})
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
    res.status(200).json({success:true,message:"done"})
}

module.exports = {
    createDepartment,
    deleteDepartment,
    editDepartment,
    getDepartments
};