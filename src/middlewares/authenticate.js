const createError = require("../utility/createError");
const jwt = require('jsonwebtoken')
const prisma = require('../model/prisma')

module.exports  = async(req,res,next)=>{
    try {
        
        const authorization = req.headers.authorization
        console.log(authorization);
        if(!authorization|| !authorization.startsWith('Bearer ')){
            console.log("errrrr")
            return createError(401,"Unauthorized")
        }
        const token = authorization.split(' ')[1]
        if(!token){
            return createError(401,"token missing")
        }

        const payload = jwt.verify(token,process.env.JWT_SECRET)
        const foundUser = await prisma.user.findFirst({
                where:{
                   id: payload.id
                }
        })
        if(!foundUser){
            return createError(401,"user not found")
        }
        const {password,createAt,updateAt,...userData}=foundUser
        req.user = userData
        console.log(req.user)
        next()
    } catch (err) {
        next(err)
    }
}