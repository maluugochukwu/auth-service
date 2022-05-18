const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const schemaRule = [
    body("name",{responseCode:14,responseMessage:"name field is required"}).isLength({min:2}).withMessage({responseCode:17,responseMessage:"Product name length is too short"}),
    body("description",{responseCode:14,responseMessage:"description field is required"}),
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