const { models: {Product,Tag,Showcase,ProductShowcase},db }  = require('../model');


const getAllFilteredProducts = async (req,res)=>{
    // this will be a post request with price and brand under filter obj, and category payload
    
    const {category,filters} = req.body;
    let filter = "";
    let join = "";
    filter += (typeof filters?.price !== 'undefined') ? ` AND product.price BETWEEN ${price[0]} AND ${price[1]}`:"";
    filter += (typeof filters?.brand !== 'undefined') ? ` AND product.brand_id = '${brand}'`:"";
    filter += (typeof filters?.category !== 'undefined') ? ` AND product.category_id = '${category}'`:"";

    const [results, metadata] = await db.sequelize.query(`SELECT product.id id,product.name name, product.price price,product.description description,product_category.name categoryName, product_category.id categoryId FROM product INNER JOIN product_category ON product.category_id = product_category.id WHERE 1 = 1 ${filter}`);
    // res.json({responseCode:0,responseMessage:"OK",data:{product:results}});
    res.status(200).json({success:true,message:"ok",data:{product:results}})
}
const addProduct = async (req,res) => {
    console.log(req.file)
    const {name,description, weight, categoryId:category_id, brandId:brand_id, price} = req.body
    const dbData = {name,description, weight, category_id, brand_id, price}
    try{
        const result = await Product.create(dbData)
        res.status(200).json({success:true,message:"Product saved"})
    }catch(er)
    {
        res.status(401).json({errors:[{code:67,message:"Could not save product"}]})
    }
}
const editProduct = async (req,res) => {
    
    const validKeys = ["name","description","weight","categoryId","brandId","price"];
    for (var property in req.body) 
    {
        if(!validKeys.includes(property))
        {
            res.status(401).json({errors:[{code:99,message:`${property} is not a valid field`}]})
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
        res.status(401).json({errors:[{code:14,message:`Could not update product`}]})
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
const searchProduct = async (req,res) => {
    const query = req.params.query;
    const [results, metadata] = await db.sequelize.query(`SELECT * FROM product INNER JOIN product_category ON product.category_id = product_category.id INNER JOIN product_tag ON product.id = product_tag.product_id  WHERE product_tag.tagname LIKE '%${query}%' OR product.name LIKE '%${query}%' `);
    res.json({responseCode:0,responseMessage:"OK",data:{product:results}});
}
const getProductDetails = async (req,res)=>{
    // get the products and option details
    // such as brand
    const product_id = req.params.product_id;
    const [products_item, metadata] = await db.sequelize.query(`SELECT * FROM product INNER JOIN product_category ON product.category_id = product_category.id  WHERE product.id = '${product_id}' `);
    // console.log(products_item)
    if(products_item.length < 1) return res.json({responseCode:68,responseMessage:"No product matches the ID"})
    const op = await getProductOptions(product_id)
    const dd = products_item[0]
    dd.optionsObj = op
    return res.json({responseCode:0,responseMessage:"ok",data:dd})
    // const [options, metadata_options] = await db.sequelize.query(`SELECT * FROM product INNER JOIN product_category ON product.category_id = product_category.id  WHERE product.id = '${product_id}' `);
    // res.json({responseCode:0,responseMessage:"OK",data:{product:results}});
}
const getProductOptions = async (product_id)=> {
    const [products_item, metadata] = await db.sequelize.query(`SELECT product_option.options_group_id options_group_id,options_group.name as options_name, GROUP_CONCAT(options_id separator '/') as option_val , GROUP_CONCAT(option.name separator '/') as option_name FROM product_option INNER JOIN options_group ON product_option.options_group_id = options_group.id INNER JOIN option ON option.id = options_id  WHERE product_id = '${product_id}' GROUP BY product_option.options_group_id`);
    const optionsArr = []
    if(products_item.length > 0) {
        // let pro = new Promise((resolve, reject) => {
            products_item.forEach((val,index)=>{
            let opt_id = val.option_val.split("/")
            let opt_name = val.option_name.split("/")
            let value = [];
            opt_id.forEach((el,i)=>{
                value.push({
                    id:el,
                    name:opt_name[i]
                })
            })
            optionsArr.push({
            id:val.options_group_id,
            name:val.options_name,
            values:value,
            })
        })
        //     resolve(optionsArr)
        // })
        
    }
    return optionsArr;
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
const getProductTableList = async(req,res)=>{
    const requestedFields = []
    const drawCount = req.body.draw
    const columns = req.body.columns
    const length = req.body.length
    const start = req.body.start
    const order = req.body.order
    const search = req.body.search
    const orderField = columns[order[0]['column']]['data']
    const orderDir = order[0]['dir']
    var searchClause = ""
    for(let x = 0; x<columns.length; x++)
    {
        requestedFields.push(columns[x]['data'])
        if(search.value != "")
        {
            searchClause += columns[x]['data']+" LIKE '%"+search.value+"%' OR "
        }
    }
    
    searchClause = search.value != ""?searchClause.slice(0,-4):" 1 = 1"
    console.log(searchClause,"secondie")
    const allowedFields = ['id','name','description','weight','category_id','price','img','has_variant','brand_id','discount','sub_category']
    var result = requestedFields.every(function(val) {

        return allowedFields.indexOf(val) >= 0;
      
      });
      if(result)
      {
          var fields = requestedFields.join(",")
          const sql = "SELECT "+fields+" FROM product WHERE "+searchClause+" ORDER BY "+orderField+" "+orderDir+" LIMIT "+start+","+length
        //   console.log(sql,"hmm")
          const [results, metadata] = await db.sequelize.query(sql);
          const sqlCount = "SELECT "+fields+" FROM product WHERE "+searchClause
          const [resultsCount, metadataCount] = await db.sequelize.query(sqlCount);
        const output = {}
        const data = []
        results.forEach(dd=>{
            let obj = {}
            for(let x = 0; x<columns.length; x++)
            {
                if(columns[x]['data'] == "price")
                {
                    obj[columns[x]['data']] = "NGN "+dd[columns[x]['data']]
                }else
                {
                    obj[columns[x]['data']] = dd[columns[x]['data']]
                }
                
            }
            data.push(obj)
        })
        output['data'] = data
        output['draw'] = drawCount
        output['recordsTotal'] = results.length
        output['recordsFiltered'] = resultsCount.length
          res.json(output);
      }else
      {
          res.json({responseCode:45,responseMessage:"No product available",data:[]});
      }
    
}
module.exports = {
    getProductShowcase,
    getProductByCategory,
    getAllFilteredProducts,
    addProduct,
    editProduct,
    deleteProduct,
    searchProduct,
    getProductDetails,
    getProductTableList
};