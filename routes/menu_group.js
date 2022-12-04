const app      = require('express');
const menu = app.Router();
const menuGroup = require('../controller/menu_group')
menu.post('/',menuGroup.addGroup)
menu.post('/:menu_id',menuGroup.editGroup)
menu.get('/',menuGroup.getGroup)
module.exports = menu;