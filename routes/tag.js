const app      = require('express');
const route = app.Router();
const tags = require('../controller/tag')

route.put('/product/:id',tags.createTag)
module.exports = route;