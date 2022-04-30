const express = require('express');
const app = express();
const logger = require('./middleware/logEvents');
const cors = require("cors");
const {db} = require("./model");

// table models sync
(async ()=>{
  await db.sequelize.sync();  
})()
//

// enabling cors for third party apps
app.use(cors({
    origin:"*"
}))

app.use(express.json());

// Logger middleware
app.use(logger);



// route for user login
app.use('/auth',
    [
        (req,res,next)=>{
            console.log("You have reached the user middleware")
            // res.sendStatus(403)
            next()
        },
        require('./routes/users')
    ]
);
app.use('/register',require('./routes/register'));



app.post('/kido/:passid', (req, res) => {
    res.send(req.params.passid);
})
app.listen('3001',()=>{
    console.log('listening on 3001')
})