const { boolean } = require("joi")
const prisma = require("../model/prisma")
const createError = require("../utility/createError")

exports.addBuyer = async(req,res,next)=>{
    try {
        const user = req.user
        if(user.role !== "ADMIN"){
            return createError(401,"unauthorized")
        }
        const {name,rate,fee} = req.body
        const newBuyer = await prisma.buyer.create({
            data:{
                name: name,
                rate:parseFloat(rate),
                fee: parseFloat(fee)
            }
        })
        res.json(newBuyer)
    } catch (err) {
        next(err)
    }
}

exports.allActiveBuyer = async(req,res,next)=>{
    try {
        const allBuyers = await prisma.buyer.findMany({
            orderBy:{id: 'asc'},
            where:{isActive:true}
        })

        res.json(allBuyers)
    } catch (err) {
        next(err)
    }
}

exports.editBuyer = async(req,res,next)=>{
    try {
        const user = req.user
        if(user.role !== "ADMIN"){
            return createError(401,"Unauthorized")
        }
        const {name,rate,fee,id,isActive} = req.body
        const prvData = await prisma.buyer.findFirst({
            where:{
                id:+id}
            })
        if(!prvData){
            return createError({message:"This buyer not exist"})
        }
        console.log(isActive);
        const data ={
            name: name === 'undefined' ? prvData.name : name || prvData?.name,
            rate: rate === 'undefined' ? prvData.rate : parseFloat(rate) || prvData?.rate,
            fee: fee === 'undefined' ? prvData.fee : parseFloat(fee) || prvData?.fee,
            isActive: isActive === 'undefined' ?prvData.isActive :isActive === "true" ?true :false,
        }
        console.log("this is data",data);
        const update = await prisma.buyer.update({
            where:{
                id:+id
            },
            data:data
        })

        res.json(update)
    } catch (err) {
        next(err)
    }
}

exports.allBuyer = async(req,res,next)=>{
    try {
        const allBuyers = await prisma.buyer.findMany({
            orderBy:{id: 'asc'}
        })

        res.json(allBuyers)
    } catch (err) {
        next(err)
    }
}