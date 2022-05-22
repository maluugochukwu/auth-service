const { models: {UserRefreshToken,User,UserRole} }  = require('../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req,res)=>{
    const {username} = req.body;
    const tokens = await issueToken(username)
    // console.log(tokens,"my tokens")
    //save refreshToken to db for the user
    UserRefreshToken.create({username: username,refresh_token:tokens.refreshToken});
    
    res.cookie('jwt',tokens.refreshToken, {httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true});

    res.json({message:"login ok",accessToken:tokens.accessToken})
}
const loginWithProvider     = async (req,res)=>{
    // check if user is already in database. if so get the user provider id
    // if the provider id matches the one passed in the query parameters; then issue a token.
    // if it does not match the one passed in the query parameters, notify the user to use the appropriate provider
    // in the case where the user does not exist in the database, create a new user and issue a token
}
const register              = async (req,res)=>{

}
const registerWithProvider  = async (req,res)=>{}

const auth = async (req,res)=>{
    
}
const issueToken = async username =>{
    const roles = await UserRole.findAll({where: {username: username}})
   
    const userRoles = []
    roles.forEach(role => userRoles.push(role.role_id))
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

module.exports = {
    login
};