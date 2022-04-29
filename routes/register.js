const app      = require('express');
const register = app.Router();
const validateRegistration = require("../middleware/validateRegistration");
const { body } = require('express-validator');

const schemaRule = [
    body("username").isEmail()
]
    
    


register.post('/',schemaRule,validateRegistration,
(req,res)=>{
    
    res.send("You have reached the register route.");
})
module.exports = register;