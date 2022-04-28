const express = require('express');
const app = express();
const logger = require('./middleware/logEvents');
const cors = require("cors");
app.use(express.json());

// Logger middleware
app.use(logger);
app.use(cors({
    origin:"*"
}))
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
app.get('/', (req, res) => {
    res.send("Am good");
})
app.post('/addUser', (req, res) => {
    res.json({"message":req.body.username});
})
app.post('/register', (req, res) => {
    res.json({"message":req.body.username});
})
app.post('/logout', (req, res) => {
    res.json({"message":req.body.username});
})


app.post('/kido/:passid', (req, res) => {
    res.send(req.params.passid);
})
app.listen('3001',()=>{
    console.log('listening on 3001')
})