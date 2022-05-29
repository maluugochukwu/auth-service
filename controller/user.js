const { models: {User,UserRole},db }  = require('../model');
const bcrypt = require('bcrypt'); 
const createUser              = async (req,res)=>{
    const provider_id = 0
    const obj = {
        username:req.body.username,
        email:req.body.email,
        role:req.body.role,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        profile_photo:req.body.profile_photo,
        provider_id:provider_id,
    }
    const status = registration(obj,provider_id)
    if(status)
    {
        res.json({
            responseCode:0,
            responseMessage:"Registration successful"
        })
    }else
    {
        res.json({
            responseCode:34,
            responseMessage:"Registration failed"
        })
    }
}
const registration = async (obj,provider_id)=>{
    if(provider_id != 0) // 3rd party auth provider 
    {
        obj.is_email_verified = 1
    }else
    {
        const hashedPassword = await bcrypt.hash(password,10);
        obj.password         = hashedPassword
    }

    const {role,username} = obj;
    
    let user_role = [];
    role.map((rl)=>{
        user_role.push({username,role_id:rl})
    })
    delete obj.role; // delete the role key from obj before inserting
    // ==== Start Database Transaction
    const transactionHandler = await db.sequelize.transaction();
    try{
            await UserRole.bulkCreate(user_role,{transaction:transactionHandler}) // save user role
            await User.create(obj,{transaction:transactionHandler}) // save user record to user table
            await transactionHandler.commit()
            if(provider_id == 0)
            {
                const message = {
                    to: `${obj.email}`,
                    subject: "Verify your email",
                    text: `Hello ${obj.firstname} ${obj.lastname},\n Use this code ${generateVerificationCode()} to verify your email`
                }
                sendEmail(message)
            }
           return true;
    }
    catch(e){
        await transactionHandler.rollback()
        return false;
    }
}
const changePassword = async (req,res)=>{
    // update password of username 
    console.log(res.locals.payload)
    const {newPassword,password} = req.body;
    const {username} = res.locals.payload
    const hashedPassword = await bcrypt.hash(newPassword,10);
    if(password == newPassword)
    {
        res.json({responseCode:97,responseMessage:"Choose a password different from the current password"})
    }
    else
    {
        User.update({password:hashedPassword},{where: {username:username}})
        .then((result) => {
            if(result[0] == 1)
            {
                res.json({responseCode:0,responseMessage:"Password changed successfully"})
            }else
            {
                res.json({responseCode:76,responseMessage:"Unable to change password"})
            }
        })
        .catch(err => res.json({responseCode:72,responseMessage:"Unable to change password"}))
    }
    
}
const editProfile = async (req, res) => {
    const username = res.locals.payload.username
    const newArr = {};
    if(req.body.email) newArr.email = req.body.email
    if(req.body.firstname) newArr.firstname = req.body.firstname
    if(req.body.lastname) newArr.lastname = req.body.lastname
    try{
        const result = await User.update(newArr,{where:{username:username}})
        res.json({responseCode:0,responseMessage:"Profile updated"})
    }catch(er)
    {
        res.json({responseCode:11,responseMessage:"Could not update profile"})
    }
}



module.exports = {
    createUser,
    changePassword,
    editProfile
};