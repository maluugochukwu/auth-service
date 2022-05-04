const { models: {User,UserRefreshToken},db }    = require('../model');
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
            const transactionHandler = await db.sequelize.transaction();
            try{
                // delete the old refresh token
                await UserRefreshToken.destroy({
                    where: {
                        refresh_token:refreshTokenString
                    }
                },{transaction:transactionHandler});

                //save refreshToken to db for the user
                await UserRefreshToken.create({username: dbUser,refresh_token:refreshTokenString},{transaction:transactionHandler});

                await traansactionHandler.commit();

                res.cookie('jwt',refreshToken, {httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true});

                res.json({message:"access token created",accessToken})
            }
            catch(e){
                await transactionHandler.rollback();
                res.status(403).json({error:[{
                    code:68,message:"could not create refresh token"
                }]})
            }
            
        }
    )
    })
}

module.exports = refreshToken;