const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJwt = (allowedRoles = [])=>{

        return function(req,res,next){
        const authHeaders = req.headers['authorization'];
        if(!authHeaders) return res.sendStatus(401);
        const token = authHeaders.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async(err,decoded)=>{
                if(err) return res.sendStatus(403)
                res.locals.payload = decoded
                // if allowedroles length is 0, then return next
                // else check the user roles if it is in the allowed roles
                if(allowedRoles?.length !== 0)
                {
                    const r = []
                    decoded.role.map((e)=>{
                        r.push(e.id)
                    })
                    const found =  allowedRoles.some(item=> r.indexOf(item) >= 0)
                    if(!found)
                    {
                        return res.status(403).json({errors:[{code:41,message:'You are not authorized to perform this action'}]})
                    }
                }
                next()
            }
        )
    }
}
module.exports = verifyJwt;