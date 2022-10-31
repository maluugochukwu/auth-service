require('dotenv').config();

const validateAuthProvider = async (req,res,next)=>{
    // console.log(req.params.provider)
    if(req.params.provider == 1) // ===============  GOOGLE Provider Service ======================
    {
        const {OAuth2Client} = require('google-auth-library');
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
        const client = new OAuth2Client(CLIENT_ID);

        const token = req.body.token
        try {
            const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            // console.log(payload)
            if(payload)
            {
                if(payload.aud == CLIENT_ID)
                {
                    res.locals.payload = payload
                    // check the provider id of the user on the db, if it matches the provider id passed
                    next()
                }else
                {
                    return res.status(416).json({errors:[{code:45,message:"Could not verify token"}]})
                }
            }else
            {
                return res.status(424).json({errors:[{code:45,message:"Could not verify token"}]})
            }
            // const userid = payload['sub'];
        }
        catch(err){
            return res.status(495).json({errors:[{code:45,message:"Could not verify token"}]})
        }
        
    }else
    {
        return res.status(418).json({errors:[{code:77,message:"Specified provider is not available"}]})
    }
}


module.exports = [validateAuthProvider];