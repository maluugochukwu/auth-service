const { models: {User,UserRole,UserAddress},db }  = require('../model');
const bcrypt = require('bcrypt'); 
const createAddress      = async (req,res)=>{
    const obj = req.body;
    obj.username = res.locals.payload.username
    const result = await UserAddress.create(obj)
    console.log(result)
    res.json({responseCode:0,responseMessage:"Saved address"})
}




module.exports = {
    createAddress
};