const { models: {User,UserRole,UserAddress},db }  = require('../model');
const bcrypt = require('bcrypt'); 
const createAddress      = async (req,res)=>{
    const obj = req.body;
    obj.username = res.locals.payload.username
    UserAddress.create(obj)
    .then((result)=>{
        if(result)
        {
            res.status(200).json({success:true,message:"Saved address"})
        }else
        {
            res.status(401).json({errors:[{code:73,message:"Could not save address"}]})
        }
    })
    .catch((err)=>{
        res.status(500).json({errors:[{code:500,message:"Internal server error"}]})
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
            
            res.status(200).json({success:true,message:"OK"})
        }else
        {
            // res.json({
            //     responseCode:33,
            //     responseMessage:"No Address found"
            // })
            res.status(401).json({errors:[{code:36,message:"No Address found"}]})
        }
        
    })
    .catch(err=>{
        
        res.status(500).json({errors:[{code:36,message:"Internal server error"}]})
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
           
            res.status(200).json({success:true,message:"Address deleted!"})
        }else
        {
            res.status(401).json({errors:[{code:624,message:"Could not delete address"}]})
        }
    })
    .catch(err=>{
        
        res.status(500).json({errors:[{code:500,message:"Internal server error"}]})
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
        
        res.status(200).json({success:true,message:"Address Updated"})
    }else
    {
        await UserAddress.update(obj,{
            where:{
                username,
                id:address_id
            }
        },{transaction:transactionHandler})
        await transactionHandler.commit()
       
        res.status(200).json({success:true,message:"Address Updated"})
    }
}




module.exports = {
    createAddress,
    getAddress,
    deleteAddress,
    editAddress
};