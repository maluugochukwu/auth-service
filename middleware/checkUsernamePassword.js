const { models: {User} }    = require('../model');
const bcrypt = require('bcrypt');

const loginCredentialsCheck = (req,res,next)=>{
    const {username,password} = req.body;
    User.findAll({
        where:{
            username: username
        }
    }).then(async (items)=>{
        if(items.length !== 0){
            const hashedPassword = items[0].password;
            const match = await bcrypt.compare(password,hashedPassword);
            if(match)
            {
                next()
            }
            else
            {
                res.status(409).json({message:"username or password is incorrect"})
            }
        }else
        {
            res.status(409).json({message:"username or password is incorrect"})
        }
        
    })
}
const registrationCredentialsCheck = (req,res,next)=>{
    const {username,password} = req.body;
    // check if username exist in database
    User.findAll({
        where:{
            username: username
        }
    }).then((items)=>{
        if(items.length !== 0){
            res.status(409).json({message:"Record already exist"})
        }else
        {
            next();
        }
        
    })
}
module.exports = {
    loginCredentialsCheck,
    registrationCredentialsCheck
}