

const validateAuthProvider = async (req,res,next)=>{
    if(req.params.provider === 1) // ===============  GOOGLE Provider Service ======================
    {
        const {OAuth2Client} = require('google-auth-library');
        const CLIENT_ID = "335006090314-6kk4mmbitkrmpn24mq5lhvbakb7fbkem.apps.googleusercontent.com";
        const CLIENT_SECRET = "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";
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

            }
        }
        const userid = payload['sub'];
    }
    
}


module.exports = [validateAuthProvider];