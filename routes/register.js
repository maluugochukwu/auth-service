const app      = require('express');
const register = app.Router();

register.get('/',(req,res)=>{
    res.send("You have reached the register route.");
})
module.exports = register;