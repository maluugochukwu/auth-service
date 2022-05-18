const express = require('express');
const app = express();
const logger = require('./middleware/logEvents');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const headers = require('./middleware/headers')
const {db} = require("./model");

// table models sync
(async ()=>{
  await db.sequelize.sync();  
//   await db.sequelize.sync({ alter: true });  
})()
//

// enabling cors for third party apps
app.use(cors({
    origin:"*"
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(headers)
app.use(cookieParser())
// Logger middleware
app.use(logger);



// route for user login
app.use('/auth',require('./routes/auth'));

// route for get users
app.use('/user',require('./routes/users'));

// route for user registeration
app.use('/register',require('./routes/register'));

// route for product
app.use('/product',require('./routes/product'));



app.post('/kido/:passid', (req, res) => {
    res.send(req.params.passid);
})
app.listen('3001',()=>{
    console.log('listening on 3001')
})