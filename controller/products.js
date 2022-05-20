const { models: {Product,Tag,Showcase,ProductShowcase},db }  = require('../model');
const bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');


const getAllFilteredProducts = async (req,res)=>{
    // this will be a post request with price and brand under filter obj, and category payload
    
    const {category,filters} = req.body;
    let filter = "";
    let join = "";
    filter += (typeof filters?.price !== 'undefined') ? ` AND product.price BETWEEN ${price[0]} AND ${price[1]}`:"";
    filter += (typeof filters?.brand !== 'undefined') ? ` AND product.brand_id = '${brand}'`:"";
    filter += (typeof filters?.category !== 'undefined') ? ` AND product.category_id = '${category}'`:"";

    const [results, metadata] = await db.sequelize.query(`SELECT product.id id,product.name name, product.price price,product.description description,product_category.name categoryName, product_category.id categoryId FROM product INNER JOIN product_category ON product.category_id = product_category.id WHERE 1 = 1 ${filter}`);
    res.json({responseCode:0,responseMessage:"OK",data:{product:results}});
}
const addProduct = async (req,res) => {
    const {name,description, weight, categoryId:category_id, brandId:brand_id, price} = req.body
    const dbData = {name,description, weight, category_id, brand_id, price}
    try{
        const result = await Product.create(dbData)
        res.json({responseCode:0,responseMessage:"Product saved"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not save product"})
    }
}
const editProduct = async (req,res) => {
    
    const validKeys = ["name","description","weight","categoryId","brandId","price"];
    for (var property in req.body) 
    {
        if(!validKeys.includes(property))
        {
            res.json({responseCode:91,responseMessage:`${property} is not a valid field`})
            return
        }
    }
    const newArr = {};
    if(req.body.name) newArr.name = req.body.name
    if(req.body.description) newArr.description = req.body.description
    if(req.body.weight) newArr.weight = req.body.weight
    if(req.body.categoryId) newArr.category_id = req.body.categoryId
    if(req.body.brandId) newArr.brand_id = req.body.brandId
    if(req.body.price) newArr.price = req.body.price

    console.log(newArr)
    try{
        const result = await Product.update(newArr,{where:{id:req.params.id}})
        res.json({responseCode:0,responseMessage:"Product updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:er})
    }
}
const deleteProduct = async (req,res) => {
    try{
        const count = await Product.destroy({ where: { id:req.params.id } });
        res.json({responseCode:0,responseMessage:`${count} product deleted`})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:er})
    }
}
const getProductByCategory = async (req,res) => {
    const category = req.params.id;
    console.log(category);
    const [results, metadata] = await db.sequelize.query(`SELECT * FROM product INNER JOIN product_category ON product.category_id = product_category.id WHERE product.category_id = '${category}'`);
    res.json({responseCode:0,responseMessage:"OK",data:{product:results}});
}
const getProductShowcase = async (req,res)=>{
    const showcase = await getActiveShowcase();
    const output = [];
    if(showcase.length > 0)
    {
        for(var x = 0; x<showcase.length; x++)
        {
            let items = showcase[x];
            let showcaseName = showcase[x].name;
            const [results, metadata] = await db.sequelize.query(`SELECT product.id as product_id, product.name as product_name,description,category_id,price,img FROM product_showcase INNER JOIN product ON product_showcase.product_id = product.id WHERE product_showcase.showcase_id = '${items.id}'`);
            output.push({showcase_name:showcaseName,products:results})
        }
        res.json({responseCode:0,responseMessage:"OK",data:output});
    }else
    {
        res.json({responseCode:45,responseMessage:"No showcase available",data:null});
    }
}
const getActiveShowcase = async ()=>{
    const [results, metadata] = await db.sequelize.query("SELECT id,name FROM showcase");
    return results;
}


module.exports = {
    getProductShowcase,
    getProductByCategory,
    getAllFilteredProducts,
    addProduct,
    editProduct,
    deleteProduct
};