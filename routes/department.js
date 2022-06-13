const app      = require('express');
const route = app.Router();
const department = require('../controller/department')

route.post('/',department.createTag)
route.delete('/:department_id',department.deleteTag)
route.post('/:id',department.editTag)
module.exports = route;