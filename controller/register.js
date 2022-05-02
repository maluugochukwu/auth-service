const { models: {User} }    = require('../model');
const bcrypt = require('bcrypt');

const register = async (req,res)=>{
    const {username,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    User.create({username,password:hashedPassword}).then((item)=>{
        // issue jwt token
        res.status(201).json({message: item})
    }).catch((err)=>{
        res.json({message:"could not save record"})
    })
}

module.exports = register;