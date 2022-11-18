const { models: {User,UserRefreshToken},db }    = require('../model');
const jwt = require('jsonwebtoken');
const {issueToken} = require("../utils/issueToken")
require('dotenv').config();
const refreshToken =  (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(403).json({errors:[{
        code:62,message:"Cannot find token"
    }]})
    const refreshTokenString = cookies.jwt;
    UserRefreshToken.findAll({
        where:{
            refresh_token: refreshTokenString
        }
    }).then((items)=>{
        if(!items) return res.status(403).json({errors:[{
            code:75,message:"Invalid refresh token"
        }]})
        
        const dbUser = items[0].username;
        jwt.verify(
        refreshTokenString,
        process.env.REFRESH_TOKEN_SECRET,
        async (err,decoded)=>{
            if(err) return res.status(403).json({errors:[{
                code:31,message:"could not verify refresh token"
            }]})
            if(dbUser !== decoded.username)  return res.status(409).json({error:[{
                code:16,message:"Token has been tampered"
            }]});
            const token = await issueToken(dbUser,true)
            const accessToken = token.accessToken
            return res.status(200).json({success:false,message:"access token created",token:accessToken})
            
            
        }
    )
    })
}

module.exports = {refreshToken};