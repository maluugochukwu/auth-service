const app      = require('express');
const route = app.Router();
const role = require('../controller/role')

route.post('/',role.createRole)
route.delete('/:id',role.deleteRole)
route.put('/:id',role.editRole)
module.exports = route;