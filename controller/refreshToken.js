const { models: {User,UserRefreshToken} }    = require('../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const refreshToken = async (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(403)
    const refreshTokenString = cookies.jwt;
    UserRefreshToken.findAll({
        where:{
            refresh_token: refreshTokenString
        }
    }).then((items)=>{
        if(!items) return res.sendStatus(403)
        
        const dbUser = items[0].username;
        jwt.verify(
        refreshTokenString,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) return res.sendStatus(403)
            if(dbUser !== decoded.username)  return res.sendStatus(409);
            
        }
    )
    })
    // check if refresh token is in the db, if so pull the user associated with it then decode the token and match the username with the username in the token
    

    const accessToken = jwt.sign(
        {
            username:"",
            role:[]
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'60s'}
    );
    const refreshToken = jwt.sign(
        {
            username:"",
            role:[]
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    );
    // delete the old refresh token
    //save refreshToken to db for the user
    res.cookie('jwt',refreshToken, {httpOnly:true,maxAge:24 * 60 * 60 * 1000});

    res.json({message:"access token created",accessToken})
}

module.exports = refreshToken;