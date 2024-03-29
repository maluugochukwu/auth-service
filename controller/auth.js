const { models: {UserRefreshToken,User,UserRole,Role},db }  = require('../model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const {issueToken,setRefreshTokenCookie} = require("../utils/issueToken")
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 
require('dotenv').config();

const login = async (req,res)=>{
    console.log(req.originalUrl);
    const {username} = req.body;
    const tokens = await issueToken(username, false)
    setRefreshTokenCookie(tokens.refreshToken,res)
    res.status(200).json({success:true,message:"Login ok",accessToken:tokens.accessToken})
}
const providerAuth     = async (req,res)=>{
    const payload = res.locals.payload
    const username = payload.email
    const provider_id = req.params.provider
    const user = await User.findAll({where: {username:username}})
    if(user?.length>0)
    {
        const user_provider_id = user[0].provider_id
        if(provider_id == user_provider_id)
        {
            const tokens = await issueToken(username,false)
            setRefreshTokenCookie(tokens.refreshToken,res)
            res.status(200).json({success:true,message:"Login ok",accessToken:tokens.accessToken})
        }else
        {
            res.status(401).json({errors:[{code:31,message:"Login with the provider you used in registering"}]})
        }
    }
    else
    {
        const firstname = payload.given_name
        const lastname = payload.family_name
        const profile_photo = payload.picture
        const obj = {
            username:username,
            email:username,
            role:[
                process.env.DEFAULT_USER_ROLE
            ],
            firstname,
            lastname,
            profile_photo,
            provider_id,
        }
        const create_user = await registration(obj,provider_id)
        if(create_user)
        {
            const tokens = await issueToken(username,false)
            
            setRefreshTokenCookie(tokens.refreshToken,res)
            
            res.status(200).json({success:true,message:"Login ok",accessToken:tokens.accessToken})
        }else
        {
            res.status(401).json({errors:[{code:55,message:"Could not create user"}]})
        }
        
    }
}
const register              = async (req,res)=>{
    const provider_id = 0
    const obj = {
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        role:[
            process.env.DEFAULT_USER_ROLE
        ],
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        profile_photo:req.body.profile_photo,
        provider_id:provider_id,
    }
    registration(obj,provider_id).then((ss) => {
        if(ss)
        {
           
            res.status(201).json({success:true,message:"Registration successful"})
            
        }else
        {
            res.status(401).json({errors:[{code:34,message:"Registration failed"}]})
        }
        
    }).catch(err => {
        console.log(err)
        
        res.status(401).json({errors:[{code:93,message:"Registration failed"}]})
    })

    
}
// const issueToken = async username =>{
//     const [results, metadata] = await db.sequelize.query(`SELECT username, user_role.role_id as u_role, role_name FROM user_role INNER JOIN role ON user_role.role_id = role.role_id WHERE username = '${username}'`)
//     const userRoles = []
//     results.forEach(role => userRoles.push({id:role.u_role,name:role.role_name}))
//     console.log(userRoles,"my roles")
//     const accessToken = jwt.sign(
//         {
//             username:username,
//             role:userRoles
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {expiresIn:'6000s'}
//     );
//     const refreshToken = jwt.sign(
//         {
//             username:username,
//             role:userRoles
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {expiresIn:'1d'}
//     );
//     await saveRefreshToken(username,refreshToken)
//     return {accessToken,refreshToken}
// }
// const saveRefreshToken = async (username,refreshTokenString)=>{
//     await UserRefreshToken.create({username: username,refresh_token:refreshTokenString});
// }
const registration = async (obj,provider_id)=>{
    if(provider_id != 0) // 3rd party auth provider 
    {
        obj.is_email_verified = 1
    }else
    {
        const password = obj.password
        const hashedPassword = await bcrypt.hash(password,10);
        obj.password         = hashedPassword
        const verificationCode = generateVerificationCode()
        obj.email_verification_code = verificationCode
        obj.email_verification_expire = new Date().setDate(new Date().getDate()+1);
        // console.log(await bcrypt.compare(password,hashedPassword))
    }

    const {role,username} = obj;
    let user_role = [];
    role.map((rl)=>{
        user_role.push({username,role_id:rl})
    })
    delete obj.role; // delete the role key from obj before inserting
    // ==== Start Database Transaction
    const transactionHandler = await db.sequelize.transaction();
    
    try{
        
            await UserRole.bulkCreate(user_role,{transaction:transactionHandler}) // save user role
            await User.create(obj,{transaction:transactionHandler}) // save user record to user table
             await transactionHandler.commit()
            if(provider_id == 0)
            {
                // const message = {
                //     to: `${obj.email}`,
                //     subject: "Verify your email",
                //     text: `Hello ${obj.firstname} ${obj.lastname},\n Use this code ${verificationCode} to verify your email`
                // }
                // sendEmail(message)
            }
           return true;
    }
    catch(e){
        await transactionHandler.rollback()
        return false;
    }
}
const sendEmail = (message)=>{
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "01fffa0ca8ebab",
          pass: "7fb0ebe681203e"
        }
      });
    message.from = "no-reply@email.com"
      
   transport.sendMail(message, function(err, info) {
        if (err) {
        //   console.log(err)
          return false
        } else {
        //   console.log(info);
          return true
        }
    })
}
const generateVerificationCode = ()=>{
    let number = "";
    for(let x = 0; x <= 4; x++)
    {
        let b = Math.floor(Math.random() * 9 + 1);
        number += b;
    }
    console.log(number)
    return number;
}

const resendEmailVerificationCode = async (req,res)=>{
    const username = req.params.username
    const user = await User.findAll({where: {username:username}})
    // console.log(user[0].is_email_verified,"holala")
    if(user?.length>0)
    {
        // check if email_verification field is 0
        if(user[0].is_email_verified == 0)
        {
            const verificationCode = generateVerificationCode()
            const expireDate = new Date().setDate(new Date().getDate()+1);
            User.update({email_verification_code:verificationCode,email_verification_expire:expireDate},{where:{username:username}})
            .then((result)=>{
                if(result[0] == 1)
                {
                    const message = {
                        to: `${user[0].email}`,
                        subject: "Verify your email",
                        text: `Hello ${user[0].firstname} ${user[0].lastname},\n Use this code ${verificationCode} to verify your email`
                    }
                    sendEmail(message)
                    
                }
            })
            const email = user[0].email
            var maskid = email.replace(/^(.)(.*)(.@.*)$/,
                (_, a, b, c) => a + b.replace(/./g, '*') + c
            );
            res.status(200).json({success:true,message:`A code has been sent to the email <b>${maskid}</b> associated to ${username}`})
        }else
        {
            res.status(401).json({errors:[{code:32,message:"Your email has already been verified"}]})
        }
        
    }else
    {
        res.status(401).json({errors:[{code:37,message:"Username does not exist"}]})
    }
    
}
const forgotPassword = async (req,res)=>{
    // send a link to the user's email to change his password
    const username = req.params.username
    const code = crypto.randomBytes(64).toString('hex')
    const currentDate = new Date()
    const expireDate = currentDate.setDate(currentDate.getDate() + 1)
    // console.log(code)
    User.update({forgotPasswordLink:code,forgotPasswordLinkExpire:expireDate},{where:{username:username}})
    .then((result)=>{
        console.log(result)
        if(result[0] == 1)
        {
            // send email notification
            // res.json({responseCode:0,responseMessage:"Check your email for a link to update set your password"})
            res.status(200).json({success:true,message:"Check your email for a link to update set your password"})
        }else
        {
            res.status(401).json({errors:[{code:32,message:"Username is incorrect"}]})
        }
    })
    .catch((error)=>{
        res.status(401).json({errors:[{code:20,message:"Username not found"}]})
    })
}
const confirmVerificationCode = async (req,res)=>{
    const username = req.params.username
    const code = req.params.code
    const [results, metadata] = await db.sequelize.query(`SELECT username FROM user WHERE email_verification_expire > NOW() AND email_verification_code = '${code}' AND username =  '${username}'`);
    if(results.length > 0)
    {
        User.update({is_email_verified:1,email_verification_expire:null},{where: {username:username}})
        .then((result) => {
            if(result)
            {
                res.status(200).json({success:true,message:"Email verified successfully"})
            }else
            {
                res.status(401).json({errors:[{code:76,message:"Unable to perform operation"}]})
            }
        })
        .catch(err => res.status(401).json({errors:[{code:71,message:"Unable to perform operation"}]}))
    }else
    {
        res.status(401).json({errors:[{code:16,message:"Invalid or expired verification code"}]})
    }
}
const setPasswordWithLink = async (req,res)=>{
    const code           = req.body.code
    
    const [results, metadata] = await db.sequelize.query(`SELECT username FROM user WHERE forgotPasswordLinkExpire > NOW() AND forgotPasswordLink = '${code}'`);
    if(results.length > 0)
    {
        const password      = req.body.password
        const hashedPassword = await bcrypt.hash(password,10);

        User.update({password:hashedPassword,forgotPasswordLink:null},{where: {forgotPasswordLink:code}})
        .then((result) => {
            if(result)
            {
                res.status(200).json({success:true,message:"Password set successfully"})
            }else
            {
                res.status(401).json({errors:[{code:76,message:"Unable to set password"}]})
            }
        })
        .catch(err => res.status(401).json({errors:[{code:76,message:"Unable to set password"}]}))
    }else{
        res.status(401).json({errors:[{code:76,message:"Expired or invalid reset link"}]})
    }
    
}


module.exports = {
    login,
    providerAuth,
    register,
    forgotPassword,
    setPasswordWithLink,
    resendEmailVerificationCode,
    confirmVerificationCode
};