const { models: {User} } = require('../model');
const register = async (req,res)=>{
    const {username,password} = req.body;
    const exist =  User.findAll({
        where:{
            username: username
        }
    }).then((items)=>{
        if(items.length !== 0){
            res.json({message:"Record already exist"})
        }else
        {
            User.create({username,password}).then((item)=>{
                
                res.json({message: item})
            }).catch((err)=>{
                res.json({message:"could not save record"})
            })
        }
        
    })
    
    
        
        // const total = await User.findAll();
    
    
    
    
    // validate user data
    // check if the username exist in the db
    // persist record in the db
    // issue token to the user
    
    // res.json({message:"Saved"})
}

module.exports = register;