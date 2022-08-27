const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const schemaRule = [
    body("name",{code:11,message:"name field is required"}).exists().isLength({min:2}).withMessage({code:17,message:"Product name length is too short"}),
    body("description",{code:12,message:"description field is required"}).exists(),
    body("weight",{code:13,message:"weight field is required"}).exists(),
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
    next();
}

module.exports = [schemaRule,validateRegistration];