const { models: {UserRefreshToken} }  = require('../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login                 = async (req,res)=>{}
const loginWithProvider     = async (req,res)=>{}
const register              = async (req,res)=>{}
const registerWithProvider  = async (req,res)=>{}
const issueToken            = async (req,res)=>{}

const auth = async (req,res)=>{
    const {username} = req.body;
    
    const accessToken = jwt.sign(
        {
            username:username,
            role:[]
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'60s'}
    );
    const refreshToken = jwt.sign(
        {
            username:username,
            role:[]
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    );
    //save refreshToken to db for the user
    UserRefreshToken.create({username: username,refresh_token:refreshToken});
    
    res.cookie('jwt',refreshToken, {httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true});

    res.json({message:"login ok",accessToken})
}

module.exports = auth;