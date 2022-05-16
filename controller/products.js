const { models: {Product,Tag,Showcase,ProductShowcase},db }  = require('../model');
const bcrypt = require('bcrypt');
const { reject } = require('bcrypt/promises');

const getAllProducts = async (req,res)=>{

    const output = [];
    console.log(req.query.cat);
    const {category,price,brand} = req.body;
    let filter = "";
    filter += (typeof price !== 'undefined') ? ` AND product.price BETWEEN ${price[0]} AND ${price[1]}`:"";


         const [results, metadata] = await db.sequelize.query(`SELECT * FROM product LEFT JOIN product_category ON product.category_id = product_category.id WHERE 1 = 1 ${filter}`);
    res.json({responseCode:0,responseMessage:"OK",data:{category:{id:category,name:results[0]["name"]},product:results}});
}
const getProductByCategory = async (req,res) => {
    const category = req.params.id;
    console.log(category);
    const [results, metadata] = await db.sequelize.query(`SELECT * FROM product LEFT JOIN product_category ON product.category_id = product_category.id WHERE product.category_id = '${category}'`);
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
            const [results, metadata] = await db.sequelize.query(`SELECT product.id as product_id, product.name as product_name,description,category_id,price,img FROM product_showcase LEFT OUTER JOIN product ON product_showcase.product_id = product.id WHERE product_showcase.showcase_id = '${items.id}'`);
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
    getAllProducts,
    createProducts,
    getProductShowcase,
    getProductByCategory
};