const { body, validationResult } = require('express-validator');
const registerValidation = (req,res,next)=>{
    // username must be an email
    body('username').isEmail()
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 })
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }else
    {
        next()
    }
    
}
module.exports = registerValidation;