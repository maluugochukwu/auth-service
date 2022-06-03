const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const addressSchemaRule = [
    body("address",{responseCode:14,responseMessage:"address field is required"}).exists().notEmpty(),
    body("state",{responseCode:14,responseMessage:"state field is required"}).exists(),
    body("town",{responseCode:14,responseMessage:"town field is required"}).exists(),
    body("lga",{responseCode:14,responseMessage:"lga field is required"}).exists(),
    body("is_primary",{responseCode:14,responseMessage:"is_primary field is required"}).exists(),
]
// ------

const validateAddress = async (req,res,next)=>{
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

module.exports = {
        "validateAddress":[addressSchemaRule,validateAddress]
    };