const prisma = require('../model/prisma')
const createError = require('../utility/createError')
const cloudinary = require('../config/cloudinary')
const fs = require('fs/promises')
const path = require('path')
const publicId = require('../utility/getPublicId')

exports.getAll = async (req, res, next) => {
    try {
        const user = req.user
        console.log(user)
        if (!user) {
            return createError(400, "no User")
        }
        const resp = await prisma.order.findMany({
            where: {
                userId: user.id,
            },
            select: {
                orderNumber: true,
                orderDate:true,
                name: true,
                detail: true,
                webLink: true,
                sellingPrice: true,
                deposite: true,
                depositeAt:true,
                remain: true,
                shippingStatus:true,
                userPaymentStatus:true,
                trackingNo:true,
                orderStatus:true,
                productImages: {
                    select: {
                        id: true,
                        image: true
                    }
                }

            }
        })
        if (!resp) {
            createError(400, "no order")
        }
        console.log("okay")
        res.json(resp)
    } catch (err) {
        next(err)
    }
},

exports.addOrder = async (req, res, next) => {
        try {
            console.log("ADD order")
            console.log(req.body)
            console.log("this is upload file input", req.file)
            const user = req.user
            if (user.role !== "ADMIN") {
                return createError(401, "Unauthorized")
            }
            const { orderDate, name, detail, webLink, sellingPrice, trackingNo, userId, buyerId, cost, } = req.body
            const currentYear = new Date(orderDate).getFullYear();
            const buyer = await prisma.buyer.findFirst({
                where:{id:+buyerId}
            })
            const lastOrder = await prisma.order.findFirst({
                where:{
                    orderNumber: {endsWith:`/${currentYear}`}
                },
                orderBy:{
                    createAt:"desc"
                }
            })
            let newOrderNumber;
            if(lastOrder){
                const lastNumber = lastOrder.orderNumber.split('/')[0]
                newOrderNumber = `${+lastNumber+1}/${currentYear}` 
            }else{
                newOrderNumber = `1/${currentYear}`
            }
            console.log(newOrderNumber);
            const data = {
                userId: +userId,
                buyerId: +buyerId,
                rate:buyer.rate,
                fee:buyer.fee,
                orderDate: orderDate ? new Date(orderDate) : new Date(),
                orderNumber: newOrderNumber,
                name: name || "-",
                detail: detail || "-",
                webLink: webLink || "-",
                sellingPrice: parseFloat(sellingPrice) || 0.0,
                cost: parseFloat(cost) || 0.0,
                trackingNo: trackingNo || "-",
            }
            let uploadResult = {}
            const haveFile = req.file
            if (haveFile) {
                uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    overwrite: true,
                    public_id: path.parse(req.file.path).name
                })
                fs.unlink(req.file.path)
            }
            const orderPicUrl = uploadResult.secure_url || "";
            console.log("Pic url ", orderPicUrl);
            const newOrder = await prisma.order.create({
                data: data
            })
            const newOrderPic = await prisma.productImage.create({
                data: {
                    image: orderPicUrl,
                    orderId: newOrder.id
                }
            })
            res.json({ newOrder, newOrderPic })
        } catch (err) {
            next(err)
        }
}

exports.deleteOrder = async(req,res,next)=>{
    try {
        const user = req.user
        if(user.role !== "ADMIN"){
            return createError(401,"Unauthorized")
        }
        const {id} = req.params
        const order = await prisma.order.findFirst({
            where:{
                id:+id
            }
        })
        if(!order){
            return createError(404,"this order not exist")
        }
        const deleteOrder = await prisma.order.delete({
            where:{
                id:+id
            }
        })

        res.json(deleteOrder)
        
    } catch (err) {
        next(err)
    }
}