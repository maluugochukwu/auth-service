// const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

// const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const schemaRule = [
    body("menuName",{code:11,message:"menuName field is required"}).exists().isLength({min:2}).withMessage({code:17,message:"MenuName name length is too short"}),
    body("menuUrl",{code:12,message:"menuUrl field is required"}).exists(),
    body("parentId",{code:13,message:"parentId field is required"}).exists(),
    body("icon",{code:14,message:"icon field is required"}).exists(),
]
// ------

const validateMenu = async (req,res,next)=>{
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

module.exports = [schemaRule,validateMenu];