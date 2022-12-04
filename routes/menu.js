const app      = require('express');
const menu = app.Router();
const menus = require('../controller/menu')
const validatemenu = require('../middleware/menu')
const verifyJwt = require('../middleware/verifyJwt')
menu.post('/addMenu',verifyJwt(["100"]),validatemenu,menus.addMenu)
menu.post('/:menu_id',verifyJwt(["100"]),validatemenu,menus.editMenu)
menu.get('/',verifyJwt(["100"]),validatemenu,menus.getMenu)
module.exports = menu;