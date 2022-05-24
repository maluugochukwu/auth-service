const { models: {UserRefreshToken,User,UserRole,Role},db }  = require('../model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();

const login = async (req,res)=>{
    const {username} = req.body;
    const tokens = await issueToken(username)
    //save refreshToken to db for the user
    UserRefreshToken.create({username: username,refresh_token:tokens.refreshToken});
    
    res.cookie('jwt',tokens.refreshToken, {
        httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true
    });

    res.json({responseCode:0,responseMessage:"login ok",accessToken:tokens.accessToken})
}
const loginWithProvider     = async (req,res)=>{
    const payload = res.locals.payload
    const username = payload.email
    const provider_id = req.params.provider
    const user = await User.findAll({where: {username:username}})
    if(user?.length>0)
    {
        const user_provider_id = user[0].provider_id
        if(provider_id == user_provider_id)
        {
            const tokens = await issueToken(username)
            setRefreshTokenCookie(tokens.refreshToken,res)
            res.json({responseCode:0,responseMessage:"login ok",accessToken:tokens.accessToken})
        }else
        {
            res.json({responseCode:31,responseMessage:"Login with the provider you used in registering"})
        }
    }else
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
            const tokens = await issueToken(username)
            
            setRefreshTokenCookie(tokens.refreshToken,res)
            
            res.json({responseCode:0,responseMessage:"login ok",accessToken:tokens.accessToken})
        }else
        {
            res.json({responseCode:55,responseMessage:"Could not create user"})
        }
        
    }
}
const register              = async (req,res)=>{
    // const dbData = {};
    // if(req.body.username) 
    // registration();
}
const registerWithProvider  = async (req,res)=>{

}

const auth = async (req,res)=>{
    
}
const issueToken = async username =>{
    
    const roles = await Role.findAll({
        include: [{
            model: UserRole,
            required: true,
            where: {username: username}
           }]
    })
    const userRoles = []
    roles.forEach(role => userRoles.push({id:role.role_id,name:""}))
    console.log(roles,"my roles")
    const accessToken = jwt.sign(
        {
            username:username,
            role:userRoles
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'60s'}
    );
    const refreshToken = jwt.sign(
        {
            username:username,
            role:userRoles
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    );
    await saveRefreshToken(username,refreshToken)
    return {accessToken,refreshToken}
}
const saveRefreshToken = async (username,refreshTokenString)=>{
    await UserRefreshToken.create({username: username,refresh_token:refreshTokenString});
}
const registration = async (obj,provider_id)=>{
    if(provider_id != 0) // 3rd party auth provider 
    {
        obj.is_email_verified = 1
    }else
    {
        const hashedPassword = await bcrypt.hash(password,10);
        obj.password         = hashedPassword
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
                var transport = nodemailer.createTransport({
                    host: "smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: "01fffa0ca8ebab",
                      pass: "7fb0ebe681203e"
                    }
                  });
                  const message = {
                    from: "from-example@email.com",
                    to: "ugo.malue@accessng.com",
                    subject: "Subject",
                    text: "Hello SMTP Email"
               }
               transport.sendMail(message, function(err, info) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(info);
                    }
                })
            }
           return true;
    }
    catch(e){
        await transactionHandler.rollback()
        return false;
    }
}

const setRefreshTokenCookie = (refreshToken,res)=>{
    res.cookie('jwt',refreshToken, {
        httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true
    });
}

module.exports = {
    login,
    loginWithProvider
};