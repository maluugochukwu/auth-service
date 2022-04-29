const app      = require('express');
const register = app.Router();
const validateRegistration = require("../middleware/validateRegistration");

register.post('/',validateRegistration,(req,res)=>{
    res.send("You have reached the register route.");
})
module.exports = register;