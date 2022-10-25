const { models: {User} }    = require('../model');
const bcrypt = require('bcrypt');

const loginCredentialsCheck = async (req,res,next)=>{
    
    const url   = req.originalUrl
    let payload = ""
    if(url == "/user/changePassword")
    {
        const username = res.locals.payload.username
        payload        = {username,password:req.body.password}
    }else
    {
        payload = req.body
    }
    const doLogin = await login(payload)
    if(doLogin.status == 0)
    {
        res.locals.payload = res.locals.payload
        next()
    }else
    {
        res.status(406).json({errors:[{"code":doLogin.status,"message":doLogin.message}]})
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
                if(match) // the user password matches
                {
                    // check to see if user account is verified
                    const isEmailVerified = items[0]['is_email_verified']
                    if(isEmailVerified == 0)
                    {
                        resolve({status:123,message:'Your email needs verification'})
                    }else
                    {
                        resolve({status:0,message:'Login successful'}) ;
                    }
                    
                }
                else
                {
                    resolve({status:55,message:'Invalid username or password'})
                }
            }else
            {
                resolve({status:69,message:'Invalid username or password'})
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
            res.status(401).json({errors:[{"code":62,"message":"Record already exist"}]})
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