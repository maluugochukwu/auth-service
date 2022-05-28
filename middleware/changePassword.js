const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const schemaRule = [
    body("username",{responseCode:14,responseMessage:"name field is required"}).exists(),
    body("password",{responseCode:14,responseMessage:"description field is required"}).exists().not().isEmpty().trim(),
    body("newPassword",{responseCode:14,responseMessage:"description field is required"}).exists().not().isEmpty().trim(),
]
// ------

const validateRegistration = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errmessg = errors.array();
        let errmessg2 = [];
        for(let { msg } of errmessg) {
            errmessg2.push(msg)
        }
       return res.status(400).json({ errors: errmessg2 });
    }
    await User.findAll({
        where:{
            username:req.body.username
        }
    })
    if(User?.length>0)
    {

        next();
    }
    else
    {
        return res.status(400).json({ responseCode: 0,responseMessa: "username does not exist" });
    }
}

module.exports = [schemaRule,validateRegistration];