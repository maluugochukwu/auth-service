const app      = require('express');
const route = app.Router();
const tags = require('../controller/tag')

route.put('/product/:id',tags.createTag)
route.delete('/',tags.deleteTag)
route.post('/:id',tags.editTag)
module.exports = route;