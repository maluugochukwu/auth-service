const { models: {UserRefreshToken,User,UserRole,Role},db }  = require('../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const issueToken = async (username,hasRefreshToken) =>{
    const [results, metadata] = await db.sequelize.query(`SELECT username, user_role.role_id as u_role, role_name FROM user_role INNER JOIN role ON user_role.role_id = role.role_id WHERE username = '${username}'`)
    const userRoles = []
    results.forEach(role => userRoles.push({id:role.u_role,name:role.role_name}))
    // console.log(userRoles,"my roles")
    const accessToken = jwt.sign(
        {
            username:username,
            role:userRoles
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'6000s'}
    );
    if(!hasRefreshToken) //if the user is not logged in, then create a refreshToken and save to db
    {
        const refreshToken = jwt.sign(
            {
                username:username
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        await saveRefreshToken(username,refreshToken)
        return {accessToken,refreshToken}
    }
    
    return {accessToken}
}

const saveRefreshToken = async (username,refreshTokenString)=>{
    await UserRefreshToken.create({username: username,refresh_token:refreshTokenString});
}

const setRefreshTokenCookie = (refreshToken,res)=>{
    res.cookie('jwt',refreshToken, {
        httpOnly:true,maxAge:24 * 60 * 60 * 1000,samesite:'None',secure:true
    });
}

module.exports = {
    issueToken,
    setRefreshTokenCookie
}