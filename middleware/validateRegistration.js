const { models: {User} }    = require('../model');
const { body,validationResult,check }  = require('express-validator');

// Data validation RULES --------------------------------
const schemaRule = [
    check("username").exists().withMessage({code:78,message:"username field is missing"}).bail().notEmpty().withMessage({responseCode:78,responseMessage:"username field is required"}),
    check("password",{code:14,message:"Password must have min of 8 characters and contain a number"}).isLength({min:8}).matches(/\d/),
    check("email",{code:14,message:"email field is not a valid email"}).notEmpty().isEmail(),
    // check("role",{code:14,message:"role field is required"}).isArray(),
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
    }else
    {
        next()
    }

    
}

module.exports = [schemaRule,validateRegistration];