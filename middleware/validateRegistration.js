const { models: {User} }    = require('../model');
const { body,validationResult,check }  = require('express-validator');

// Data validation RULES --------------------------------
const schemaRule = [
    check("username").exists().withMessage({responseCode:78,responseMessage:"username field is missing"}).bail().notEmpty().withMessage({responseCode:78,responseMessage:"username field is required"}),
    check("password",{responseCode:14,responseMessage:"Password must have min of 8 characters and contain a number"}).isLength({min:8}).matches(/\d/),
    check("email",{responseCode:14,responseMessage:"email field is not a valid email"}).notEmpty().isEmail(),
    check("role",{responseCode:14,responseMessage:"role field is required"}).isArray(),
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