const { models: {User,UserRole,UserAddress},db }  = require('../model');
const bcrypt = require('bcrypt'); 
const createAddress      = async (req,res)=>{
    const obj = req.body;
    obj.username = res.locals.payload.username
    UserAddress.create(obj)
    .then((result)=>{
        if(result)
        {
            res.json({responseCode:0,responseMessage:"Saved address"})
        }else
        {
            res.json({responseCode:73,responseMessage:"Could not save address"})
        }
    })
    .catch((err)=>{
        res.json({responseCode:63,responseMessage:"Internal server error"})
    })
    
}
const getAddress = (req,res)=>{
    const username = res.locals.payload.username
    UserAddress.findAll({
        where:{
            username
        }
    })
    .then(result=>{
        if(result.length > 0)
        {
            res.json({
                responseCode:0,
                responseMessage:"OK",
                data:result
            })
        }else
        {
            res.json({
                responseCode:33,
                responseMessage:"No Address found"
            })
        }
        
    })
    .catch(err=>{
        res.json({
            responseCode:33,
            responseMessage:"Internal server error"
        })
    })
}

const deleteAddress = (req,res)=>{
    const address_id = req.params.address_id
    const username = res.locals.payload.username
    UserAddress.destroy({
        where:{
            id:address_id,
            username
        }
    })
    .then(count=>{
        if(count > 1)
        {
            res.json({
                responseCode:0,
                responseMessage:"Address deleted!"
            })
        }else
        {
            res.json({
                responseCode:61,
                responseMessage:"Could not delete address"
            })
        }
    })
    .catch(err=>{
        res.json({
            responseCode:12,
            responseMessage:"Internal server error"
        })
    })
}

const editAddress = async (req,res)=>{
    const address_id = req.params.address_id
    const username = res.locals.payload.username
    const obj = {}
    if(req.body.address) obj.address = req.body.address
    if(req.body.state) obj.address   = req.body.state
    if(req.body.lga) obj.address     = req.body.lga
    if(req.body.town) obj.address    = req.body.town
    if(req.body.is_primary) obj.is_primary    = req.body.is_primary
    const transactionHandler = await db.sequelize.transaction();
    if(obj.is_primary == 1)
    {
        
        await UserAddress.update({is_primary:0},{
            where:{
                username
            }
        },{transaction:transactionHandler})

        await UserAddress.update(obj,{
            where:{
                username,
                id:address_id
            }
        },{transaction:transactionHandler})
        await transactionHandler.commit()
        res.json({
            responseCode:0,
            responseMessage:"Address updated"
        })
    }else
    {
        await UserAddress.update(obj,{
            where:{
                username,
                id:address_id
            }
        },{transaction:transactionHandler})
        await transactionHandler.commit()
        res.json({
            responseCode:0,
            responseMessage:"Address updated"
        })
    }
}




module.exports = {
    createAddress,
    getAddress,
    deleteAddress,
    editAddress
};