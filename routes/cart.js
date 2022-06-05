const app      = require('express');
const route = app.Router();
const cart = require('../controller/cart')

route.post('/verify',cart.verifyCart)
module.exports = route;