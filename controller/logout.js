const { models: {User,UserRefreshToken},db }  = require('../model');
const logout = (req,res)=>{
    const cookie = req.cookie;
    if(!cookie?.jwt) return res.sendStatus(403)

    const refreshTokenString = cookie.jwt;

    UserRefreshToken.findAll({
        where:{
            refresh_token: refreshTokenString
        }
    }).then((item)=>{
        if(!item){
            res.clearCookie('jwt',{httpOnly:true,samesite:'None',secure:true})
            res.sendStatus(403)
        }
        await UserRefreshToken.destroy({
            where:{
                refresh_token: refreshTokenString
            }
        })
        res.clearCookie('jwt',{httpOnly:true,samesite:'None',secure:true})
    })

    res.status(401).json({
        message:"Logout successful"
    })
}