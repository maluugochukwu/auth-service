const { models: {User,UserRole},db }  = require('../model');
const bcrypt = require('bcrypt');

const register = async (req,res)=>{
    const {username,password,role} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);
        let user_role = [];
        role.map((rl)=>{
            user_role.push({username,role_id:rl})
        })

        // ==== Start Database Transaction
        const transactionHandler = await db.sequelize.transaction();
        try{
                await UserRole.bulkCreate(user_role,{transaction:transactionHandler}) // save user role
                await User.create({username,password:hashedPassword},{transaction:transactionHandler}) // save user record to user table
                await transactionHandler.commit()
                res.status(200).json({message:"Record saved!"})
        }
        catch(e){
            await transactionHandler.rollback()
            res.status(403).json({message:"Could not save record"})
        }
        
}

module.exports = register;