const { models: {User,UserRole,Product},db }  = require('../model');
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
    console.log(res.locals.payload)
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
const addAddress = async (req,res)=>{
    const username = res.locals.payload.username
    
    res.json({

    })
}
const checkout = async (req,res)=>{

    // const cartStructure = {
    //     products:[
    //         {
    //             id:87,
    //             quantity:5,
    //             optionId:null
    //         }
    //     ]
    // }
    const products = req.body.products
    const username = res.locals.payload.username
    let totalPrice = 0;
    for(let x=0; x < products.length; x++) {
        let product = products[x];
        let product_id = product.id
        let product_price = product.price
        let product_quantity = product.quantity
        let netPrice = product_price
        const dbresult = await Product.findAll({
            where:{
                id:product_id
            }
        })
        if(dbresult?.length > 0)
        {
            const result = dbresult[0]
            let product_name = result.name;
            let product_description = result.description;
            if(product_quantity < 1) return res.json({responseCode:58,responseMessage:`Enter a quantity for this product (${product_name})`})
            if(producthasOption(product_id) && product.optionId == null) return res.json({responseCode:58,responseMessage:`Kindly pick a variant for this product (${product_name})`})
            //check if the option id is valid
            
            let discount = result.discount
            let optionCharge = 0
            if(product.optionId != null)
            {
                optionCharge = getOptionCharge(product.optionId)
                netPrice = netPrice + optionCharge
            }
            netPrice = netPrice - (discount/100 * netPrice)
            totalPrice += netPrice

            const deliveryAddress = geUserDeliveryAddress(username)
            if(deliveryAddress == null) return res.json({responseCode:118,responseMessage:"Could not find a primary address"})
            const o_id = orderid.generate();
            await Order.create({
                order_id:o_id,
                product_id:product_id,
                product_name:product_name,
                product_description:product_description,
                product_image:"",
                net_price:netPrice,
                shipping_fee:"",
                payment_id:"",
                tracking_number:"",
                discount:`${discount}%`,
                option_charge:optionCharge,
                option_id:product.optionId,
                quantity:product_quantity,
                price:product_price,
                user_id:username,
                delivery_address:deliveryAddress.address,
                delivery_state:deliveryAddress.state,
                delivery_lga:deliveryAddress.lga,
                delivery_town:deliveryAddress.town,
            })
           products[x].optionCharge = optionCharge
           products[x].price = product_price
           products[x].discount = product_price
           products[x].netPrice = netPrice
        }else
        {
            return res.json({responseCode:58,responseMessage:`An object has an invalid product id (${product_id})`})
        }
        
    }
        
  const output = {products,shipping:0,tax:0,total:totalPrice}
    return res.json({responseCode:0,responseMessage:"Order logged",data:output})
}
const producthasOption = product_id =>{
    return false;
}
const getOptionCharge = optionId =>{
    return -15;
}
const createOrder = product =>{
    return true;
}
const generatePaymentId = (amount) =>{
    return 448655665;
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
    addAddress,
    checkout
};