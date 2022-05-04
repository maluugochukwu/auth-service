const { models: {User} }    = require('../model');
const { body,validationResult }  = require('express-validator');
const bcrypt = require('bcrypt');

// Data validation RULES --------------------------------
const schemaRule = [
    body("username").isEmail().withMessage({code:78,message:"Must be a valid email"}),
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

    const {username,password} = req.body;
    // check if username exist in database
    User.findAll({
        where:{
            username: username
        }
    }).then(async (items)=>{
        if(items.length !== 0){
            const hashedPassword = items[0].password;
            const match = await bcrypt.compare(password,hashedPassword);
            if(match)
            {
                next()
            }else
            {
                res.status(409).json({message:"username or password is incorrect"})
            }
        }else
        {
            res.status(409).json({message:"username or password is incorrect"})
        }
        
    })
}

module.exports = [schemaRule,validateAuth];