require('dotenv').config();

const validateAuthProvider = async (req,res,next)=>{
    if(req.params.provider === 1) // ===============  GOOGLE Provider Service ======================
    {
        const {OAuth2Client} = require('google-auth-library');
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
        const client = new OAuth2Client(CLIENT_ID);

        const token = req.body.token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        console.log(payload)
        if(payload)
        {
            if(payload.aud == CLIENT_ID)
            {
                next()
            }else
            {
                res.json({responseCode:58,responseMessage:"Could not verify token"})
            }
        }else
        {
            res.json({responseCode:58,responseMessage:"Could not verify token"})
        }
        // const userid = payload['sub'];
    }
    
}


module.exports = [validateAuthProvider];