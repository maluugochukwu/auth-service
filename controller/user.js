const { models: {User,UserRole,Product,Option,Order,ProductOption,Transaction},db }  = require('../model');
const bcrypt = require('bcrypt'); 
const orderid = require('order-id')('key'); 
const createUser              = async (req,res)=>{
    const provider_id = 0
    const obj = {
        username:req.body.username,
        email:req.body.email,
        role:req.body.role,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        profile_photo:req.body.profile_photo,
        provider_id:provider_id,
    }
    const status = registration(obj,provider_id)
    if(status)
    {
        res.json({
            responseCode:0,
            responseMessage:"Registration successful"
        })
    }else
    {
        res.json({
            responseCode:34,
            responseMessage:"Registration failed"
        })
    }
}
const registration = async (obj,provider_id)=>{
    if(provider_id != 0) // 3rd party auth provider 
    {
        obj.is_email_verified = 1
    }else
    {
        const hashedPassword = await bcrypt.hash(password,10);
        obj.password         = hashedPassword
    }

    const {role,username} = obj;
    
    let user_role = [];
    role.map((rl)=>{
        user_role.push({username,role_id:rl})
    })
    delete obj.role; // delete the role key from obj before inserting
    // ==== Start Database Transaction
    const transactionHandler = await db.sequelize.transaction();
    try{
            await UserRole.bulkCreate(user_role,{transaction:transactionHandler}) // save user role
            await User.create(obj,{transaction:transactionHandler}) // save user record to user table
            await transactionHandler.commit()
            if(provider_id == 0)
            {
                const message = {
                    to: `${obj.email}`,
                    subject: "Verify your email",
                    text: `Hello ${obj.firstname} ${obj.lastname},\n Use this code ${generateVerificationCode()} to verify your email`
                }
                sendEmail(message)
            }
           return true;
    }
    catch(e){
        await transactionHandler.rollback()
        return false;
    }
}
const changePassword = async (req,res)=>{
    // update password of username 
    // console.log(res.locals.payload)
    const {newPassword,password} = req.body;
    const {username} = res.locals.payload
    const hashedPassword = await bcrypt.hash(newPassword,10);
    if(password == newPassword)
    {
        res.json({responseCode:97,responseMessage:"Choose a password different from the current password"})
    }
    else
    {
        User.update({password:hashedPassword},{where: {username:username}})
        .then((result) => {
            if(result[0] == 1)
            {
                res.json({responseCode:0,responseMessage:"Password changed successfully"})
            }else
            {
                res.json({responseCode:76,responseMessage:"Unable to change password"})
            }
        })
        .catch(err => res.json({responseCode:72,responseMessage:"Unable to change password"}))
    }
    
}
const editProfile = async (req, res) => {
    const username = res.locals.payload.username
    const newArr = {};
    if(req.body.email) newArr.email = req.body.email
    if(req.body.firstname) newArr.firstname = req.body.firstname
    if(req.body.lastname) newArr.lastname = req.body.lastname
    try{
        const result = await User.update(newArr,{where:{username:username}})
        res.json({responseCode:0,responseMessage:"Profile updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update profile"})
    }
}
const findDuplicates = (array)=>{
    const r = []
    array.reduce((total,amount)=>{
        r.push(amount.id)
        return amount.id
    },0)
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < r.length; ++i) {
        var value = r[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
    
}
const checkout = async (req,res)=>{
    
    
    // const cartStructure = {
    //     products:[
    //         {
    //             id:87,
    //             quantity:5,
    //             options:[
    //                 [1,1], // option group id, option value id
    //                 [2,1]
    //             ]
    //         }
    //     ]
    // }
    if(findDuplicates(req.body.products)) return res.json({responseCode:41,responseMessage:"Product ID on each object must be unique"})
    const products = req.body.products
    const username = res.locals.payload.username
    const payment_id = generatePaymentId();
    const orderObj = []
    let totalPrice = 0;
    for(let x=0; x < products.length; x++) {
        let product = products[x];
        let product_id = product.id
        
        let product_quantity = product.quantity
        
        const dbresult = await Product.findAll({
            where:{
                id:product_id
            }
        })
        if(dbresult?.length > 0)
        {
            const result = dbresult[0]
            let product_name = result.name;
            let product_price = parseInt(result.price)
            let netPrice = product_price
            let product_description = result.description;
            let product_image = result.img;
            if(product_quantity < 1) return res.json({responseCode:58,responseMessage:`Enter a quantity for this product (${product_name})`})
            let hasOption = await producthasOption(product_id)
            if(hasOption && product.options.length == 0) return res.json({responseCode:58,responseMessage:`Kindly pick a variant for this product (${product_name})`})
            
            let optionCharge = 0
            if(hasOption)
            {
                const duplOptions = await isDuplicateOptionGroupAndSameOptionsCount(product_id, product.options)
                if(duplOptions[0]) return res.json({responseCode:91,responseMessage:`${duplOptions[1]}`})
                for(let x = 0; x< product.options.length; x++) {
                    let isProductOptionCorrect = await isProductOptionValid(product.options[x][0],product.options[x][1],product_id)

                    
                    
                    //check if the option id is valid for the product
                    if(!isProductOptionCorrect) return res.json({responseCode:51,responseMessage:`This product (${product_name}) has either an invalid option group id or option value id`})
                    optionCharge = parseInt(await getOptionCharge(product.options[x][0]))
                    netPrice = netPrice + optionCharge
                }
            }
            
            

            let discount = parseInt(result.discount)
            
            netPrice = (netPrice - (discount/100 * netPrice)) * product_quantity
            totalPrice += netPrice

            const deliveryAddress = geUserDeliveryAddress(username)
            if(deliveryAddress == null) return res.json({responseCode:118,responseMessage:"Could not find a primary address"})
            const o_id = orderid.generate();
            orderObj.push( {
                order_id:o_id,
                product_id:product_id,
                product_name:product_name,
                product_description:product_description,
                product_image:product_image,
                net_price:netPrice,
                shipping_fee:10,
                payment_id:payment_id,
                tracking_number:"",
                discount:`${discount}%`,
                option_charge:optionCharge,
                option_id:JSON.stringify(product.options),
                quantity:product_quantity,
                price:product_price,
                user_id:username,
                delivery_address:deliveryAddress.address,
                delivery_state:deliveryAddress.state,
                delivery_lga:deliveryAddress.lga,
                delivery_town:deliveryAddress.town,
            })
           
           products[x].optionCharge = optionCharge
           products[x].unitPrice = product_price
           products[x].unitPriceWithCharges = product_price + optionCharge
           
           products[x].quantityPrice = (product_price + optionCharge) * product_quantity
           products[x].discount = discount
           products[x].netPrice = netPrice
        }else
        {
           return res.json({responseCode:58,responseMessage:`An object has an invalid product id (${product_id})`})
        }
        
    }
    const transactionHandler = await db.sequelize.transaction()
    await Order.bulkCreate(orderObj,{transaction:transactionHandler})
    await Transaction.create({
        transaction_id:payment_id,
        source_acct:username,
        destination_acct:"ECOMMERCE STORE ACCOUNT",
        transaction_desc:"PAYMENT FOR GOODS",
        transaction_amount:totalPrice,
        response_code:99,
        posted_ip:req.socket.remoteAddress,
        response_message:"INITIALIZED",
        reference_trans_id:"",
        user_id:username
    },{transaction:transactionHandler})
    await transactionHandler.commit()
    const output = {products,shipping:0,tax:0,total:totalPrice,paymentId:payment_id}
    return res.json({responseCode:0,responseMessage:"Order logged",data:output})
}

const producthasOption = async product_id =>{
    const dbresult = await ProductOption.findAll({
        where:{
            product_id
        }
    })
    if(dbresult.length > 0)
    {
        
        return true;
    }else
    {
        return false;
    }
    
}
const getOptionDetails = async(id) =>{
    await Option.find({

    })
}
const isDuplicateOptionGroupAndSameOptionsCount = async (product_id,optionsArr)=>{
    const storage = []
    for(let x=0; x<optionsArr.length; x++) {
        storage.push(optionsArr[x][0])
    }
    // console.log(storage)
    if(storage.length !== new Set(storage).size)
    {
        return [true,`Options group id for each option has to be unique`]
    }
    
    const [dbresult, metadata] = await db.sequelize.query(`SELECT * FROM product_option  WHERE product_id = '${product_id}' GROUP BY options_group_id `);
    if(dbresult.length != optionsArr.length)
    {
        return [true,`${dbresult.length} options are required for this product, you only choose ${optionsArr.length}`]
    }else
    {
        return [false]
    }
}
const getOptionCharge = async optionId =>{
    const dbresult = await ProductOption.findAll({
        where:{
            id:optionId,
        }
    })
    // console.log(dbresult)
    if(dbresult.length > 0)
    {
        
        return dbresult[0].charge;
    }
}
const isProductOptionValid = async (optionGroupId,optionsID,product_id) =>{
    const dbresult = await ProductOption.findAll({
        where:{
            options_group_id:optionGroupId,
            options_id:optionsID,
            product_id
        }
    })
    // console.log(dbresult)
    if(dbresult.length > 0)
    {
        
        return true;
    }else
    {
        return false;
    }
}
const generatePaymentId = (amount) =>{
    const start = new Date(2012, 0, 1);
    const end = new Date()
    let time = Date.now() + Math.random()
    // time = time.replace(".",7)
    console.log(time)
    return time;
}
const geUserDeliveryAddress = (username) =>{
    // get the user's primary address user_address, if there are no primary address return null
    return {
        address:"",
        state:"",
        lga:"",
        town:"",
    }
}


module.exports = {
    createUser,
    changePassword,
    editProfile,
    checkout
};