const { models: {User} }    = require('../model');


const register = async (req,res)=>{
    const {username,password} = req.body;
    User.create({username,password}).then((item)=>{
                
        res.json({message: item})
    }).catch((err)=>{
        res.json({message:"could not save record"})
    })
}

module.exports = register;