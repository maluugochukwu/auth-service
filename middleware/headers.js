const headers = (req,res,next)=>{
    const origin = req.headers.origin;

    res.header('Access-Control-Allow-Credentials',true)
    next()
}
module.exports = headers