const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');

const allowedFields = ['nam'];

// Data validation RULES --------------------------------
const schemaRule = [
    body("name").isIn(['123', 'password', 'god']),
    body("password",{responseCode:14,responseMessage:"Password must have min of 8 characters and contain a number"}).isLength({min:8}).matches(/\d/)
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

    const {username,password} = req.body;
    // check if username exist in database
    User.findAll({
        where:{
            username: username
        }
    }).then((items)=>{
        if(items.length !== 0){
            res.status(409).json({message:"Record already exist"})
        }else
        {
            next();
        }
        
    })
}

module.exports = [schemaRule,validateRegistration];