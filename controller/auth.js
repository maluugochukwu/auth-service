const { models: {UserRefreshToken,User,UserRole} }  = require('../model');
const jwt = require('jsonwebtoken');
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
    // check if user is already in database. if so get the user provider id
    // if the provider id matches the one passed in the query parameters; then issue a token.
    // if it does not match the one passed in the query parameters, notify the user to use the appropriate provider
    // in the case where the user does not exist in the database, create a new user and issue a token
    const payload = res.locals.payload
    const username = payload.username
    const provider_id = req.params.provider
    const user = await User.findAll({where: {username:username}})
    if(user)
    {
        const user_provider_id = user[0].provider_id
        if(provider_id == user_provider_id)
        {
            const tokens = await issueToken(username)
            res.cookie('jwt',tokens.refreshToken, {
                httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true
            });
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
            firstname,
            lastname,
            profile_photo,
            provider_id
        }
        const create_user = await registration(obj,[210])
        const tokens = await issueToken(username)
        setRefreshTokenCookie(tokens.refreshToken,res)
        
        res.json({responseCode:0,responseMessage:"login ok",accessToken:tokens.accessToken})
    }
}
const register              = async (req,res)=>{

}
const registerWithProvider  = async (req,res)=>{

}

const auth = async (req,res)=>{
    
}
const issueToken = async username =>{
    const roles = await UserRole.findAll({where: {username: username}})
   
    const userRoles = []
    roles.forEach(role => userRoles.push({id:role.role_id,name:""}))
    console.log(userRoles,"my roles")
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
    return {accessToken,refreshToken}
}
const registration = async (obj,roles)=>{

    // insert to user table
    const create_user = await User.create(obj)
    
    const dbroles = []
    roles.forEach((r_id)=>{
        dbroles.push({
            username:obj.username,
            role_id:r_id
        })
    })
    // insert record to user_roles
    await UserRole.bulkCreate(dbroles)
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