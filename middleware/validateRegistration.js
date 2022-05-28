const { models: {User} }    = require('../model');
const { body,validationResult,check }  = require('express-validator');

// Data validation RULES --------------------------------
const schemaRule = [
    check("username").exists().withMessage({responseCode:78,responseMessage:"username field is missing"}).bail().isEmail().withMessage({responseCode:78,responseMessage:"Must be a valid email"}),
    check("password",{responseCode:14,responseMessage:"Password must have min of 8 characters and contain a number"}).isLength({min:8}).matches(/\d/)
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