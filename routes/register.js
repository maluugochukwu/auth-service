const app      = require('express');
const register = app.Router();
const validateRegistration = require("../middleware/validateRegistration");
const { body } = require('express-validator');

const schemaRule = [
    body("username").isEmail()
]
    
    


register.post('/',schemaRule,validateRegistration,
require('../controller/register'))
module.exports = register;