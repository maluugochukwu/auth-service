const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');
const bcrypt = require('bcrypt');

// Data validation RULES --------------------------------
const schemaRule = [
    body("username").isEmail().withMessage({code:78,message:"Username must be a valid email"}),
    body("password",{code:14,message:"Password is required"}).not().isEmpty().trim()
]
// ------

const validateAuth = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errmessg = errors.array();
        let errmessg2 = [];
        for(let { msg } of errmessg) {
            errmessg2.push(msg)
        }
       return res.status(400).json({ errors: errmessg2 });
    }
    else
    {
        next()
    }
}


module.exports = [schemaRule,validateAuth];