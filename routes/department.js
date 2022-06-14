const app      = require('express');
const route = app.Router();
const department = require('../controller/department')

route.get('/',department.getDepartments)
route.post('/',department.createDepartment)
route.delete('/:department_id',department.deleteDepartment)
route.post('/:id',department.editDepartment)
module.exports = route;