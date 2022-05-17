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
    const productObj = req.body
    await Product.create(productObj)
}
const editProduct = async (req,res) => {
    
}
const deleteProduct = async (req,res) => {
    
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
const createProducts = async (req,res)=>{
    
}
const getActiveShowcase = async ()=>{
    const [results, metadata] = await db.sequelize.query("SELECT id,name FROM showcase");
    return results;
}


module.exports = {
    
    createProducts,
    getProductShowcase,
    getProductByCategory,
    getAllFilteredProducts
};