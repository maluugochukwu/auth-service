const { models: {User} }    = require('../model');
const bcrypt = require('bcrypt');

const loginCredentialsCheck = async (req,res,next)=>{
    
    const url = req.originalUrl
    let payload = ""
    if(url == "/user/changePassword")
    {
        const username = res.locals.payload.username
        payload = {username,password:req.body.password}
    }else
    {
        payload = req.body
    }
    const doLogin = await login(payload)
    if(doLogin)
    {
        res.locals.payload = res.locals.payload
        next()
    }else
    {
        res.status(409).json({message:"username or password is incorrect"})
    }
}

const login = (payload) => {
    const {username,password} = payload;
    return new Promise((resolve,reject) => {
        User.findAll({
            where:{
                username: username
            }
        }).then(async (items)=>{
            if(items.length !== 0)
            {
                const hashedPassword = items[0].password;
                const match          = await bcrypt.compare(password,hashedPassword);
                if(match)
                {
                    resolve(true) ;
                }
                else
                {
                    resolve(false) ;
                }
            }else
            {
                resolve(false);
            }
            
        })
    })
    
}

const registrationCredentialsCheck = (req,res,next)=>{
    const {username} = res.locals.payload;
    // check if username exist in database
    User.findAll({
        where:{
            username: username
        }
    }).then((items)=>{
        if(items.length !== 0){
            res.status(409).json({message:"Record already exist"})
        }else
        {
            next();
        }
        
    })
}
module.exports = {
    loginCredentialsCheck,
    registrationCredentialsCheck
}