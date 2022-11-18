const express = require('express');
const app = express();
const logger = require('./middleware/logEvents');
const cors = require("cors");
const multer = require('multer')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const formidableMiddleware = require('express-formidable');
const headers = require('./middleware/headers')
const {db} = require("./model");

// table models sync
(async ()=>{
//   await db.sequelize.sync();  
  await db.sequelize.sync({ alter: true });  
})()
//

// enabling cors for third party apps
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
const upload = multer({dest:'./uploads/'})
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.use(formidableMiddleware());
app.use(headers)
app.use(cookieParser())
// app.use(bodyParser.urlencoded({ extended: true }))
// Logger middleware
// app.use(logger);

app.post('/', upload.single('thumbnail'), (req, res) => {
    console.log(req.file)
    res.send(req.body);
})


// route for user login
app.use('/auth',require('./routes/auth'));



// route for get users
app.use('/user',require('./routes/users'));

// route for roles
app.use('/role',require('./routes/role'));

// route for user registeration
app.use('/register',require('./routes/register'));

// route for product
app.use('/product',require('./routes/product'));

// route for tag
app.use('/tag',require('./routes/tag'));

// route for department
app.use('/department',require('./routes/department'));


// route for refreshToken
app.use('/refreshToken',require('./routes/refreshToken'));



// route for cart
// app.use('/cart',require('./routes/cart'));



app.post('/kido/:passid', (req, res) => {
    res.send(req.params.passid);
})
app.listen('3001',()=>{
    console.log('listening on 3001')
})