const { models: {ProductTag} }  = require('../model');
const createTag = async (req,res)=>{
    const data = req.body
    const pid = req.params.id
    const newArr = []
    data.forEach(element => {
        newArr.push({ product_id:pid,tagname:element})
    });
    
    try
    {
        const result = await ProductTag.bulkCreate(newArr)
        res.json({responseCode:0,responseMessage:"ok"})
    }catch(err) {
        res.json({responseCode:89,responseMessage:"Could not tag product. Possible duplicate tag name found"})
    }
}
const deleteTag = async (req,res)=>{
    try{
        const count = await ProductTag.destroy({ where: { tagname:req.body.tagName,product_id:req.body.productId } });
        res.json({responseCode:0,responseMessage:`${count} tag deleted`})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not delete tag"})
    }
}
const editTag = async (req,res)=>{
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
const getProductTag = async (req,res)=>{

}

module.exports = {
    createTag,
    deleteTag,
    editTag,
    getProductTag
};