
const fs = require('fs');
const fsPromise = require('fs').promises
const path = require('path');
const {format} = require('date-fns')

const logEvents = async (message,logName) => {
    const dateTime = format(new Date(),'HH:mm:ss');
    const logItem = `\n[${dateTime}]\n${message}\n`;
    const year = `${format(new Date(),'yyyy')}`
    const month = `${format(new Date(),'MMMM')}`
    const day = `${format(new Date(),'dd')}`

    const createDir = new Promise(async (resolve, reject)=>{
        try{
            if(!fs.existsSync(path.join(__dirname,'..',`logs`)))
            {
                await fs.mkdirSync(path.join(__dirname,'..',`logs`))
                
            }
            if(!fs.existsSync(path.join(__dirname,'..',`logs/${year}`)))
            {
                await fs.mkdirSync(path.join(__dirname,'..',`logs/${year}`))
                await fs.mkdirSync(path.join(__dirname,'..',`logs/${year}/${month}`))
            }else{
                if(!fs.existsSync(path.join(__dirname,'..',`logs/${year}/${month}`)))
                {
                    await fs.mkdirSync(path.join(__dirname,'..',`logs/${year}/${month}`))
                }
            }
            
            
            resolve(true);
        }
        catch(err){
            reject(err)
        }
        
    })
    try{
        // console.log(createDir)
        createDir.then(async (rr)=>{
            await fsPromise.appendFile(path.join(__dirname,'..',`logs/${year}/${month}`,logName),logItem)
        })
    }
    catch(err){
        console.log(err)
    }
}
const logger = (req,res,next)=>{
    const message = `${req?.method} ~ ${JSON.stringify(req?.body) } ~ ${req.url} ~ [${req.socket.remoteAddress}]`;
    const filename = `${format(new Date(),'dd')}.txt`
    logEvents(message,filename);
    next();
}
module.exports = logger;