const prisma = require('../model/prisma')
const createError = require("../utility/createError")
const cloudinary = require('../config/cloudinary')
const fs = require('fs/promises')
const path = require('path')
const publicId = require('../utility/getPublicId')

exports.getAllOrders = async (req, res, next) => {
    try {
        const user = req.user
        if (user.role !== "ADMIN") {
            return createError(401, "Unauthorized")
        }
        const allOrders = await prisma.order.findMany({
            orderBy: { createAt: 'asc' },
            select: {
                id: true,
                orderDate: true,
                orderNumber: true,
                name: true,
                detail: true,
                webLink: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,

                    }
                },
                sellingPrice: true,
                deposite: true,
                depositeAt:true,
                remain: true,
                userPaymentStatus: true,
                buyerPaymentStatus: true,
                buyer: {
                    select: {
                        name: true,
                        rate: true,
                        fee: true,
                        id:true,
                    }
                },
                trackingNo: true,
                shippingStatus: true,
                createAt: true,
                updateAt: true,
                orderStatus: true,
                cost: true,
                fee:true,
                rate:true,
                productImages: {
                    select: {
                        image: true
                    }
                }
            }

        })
        res.json(allOrders)
    } catch (err) {
        next(err)
    }
}

exports.editOrder = async (req, res, next) => {
    try {
        const { id, buyerId, userId, buyerPaymentStatus, cost, deposite, detail, name, orderDate, orderStatus, sellingPrice, shippingStatus, trackingNo, userPaymentStatus, webLink,depositeAt,rate,fee } = req.body
        const user = req.user
        if (user.role !== "ADMIN") {
            return createError(401, "Unauthorized")
        }
        const prvData = await prisma.order.findFirst({
            where: { id: +id }
        })
        console.log("this is prv", prvData);
        const data = {
            name: name === 'undefined' ? prvData.name : name || prvData?.name,
            buyerId: buyerId === 'undefined' ? prvData.buyerId : +buyerId || prvData?.buyerId,
            buyerPaymentStatus: buyerPaymentStatus === 'undefined' ? prvData.buyerPaymentStatus : buyerPaymentStatus || prvData?.buyerPaymentStatus,
            cost: cost === 'undefined' ? prvData.cost : parseFloat(cost) || prvData?.cost,
            deposite: deposite === 'undefined' ? prvData.deposite : parseFloat(deposite) || prvData?.deposite,
            depositeAt: depositeAt === 'undefined' ? prvData.depositeAt : new Date(depositeAt) || prvData?.depositeAt,
            detail: detail === 'undefined' ? prvData.detail : detail || prvData.detail,
            orderDate: orderDate === 'undefined' ? prvData.orderDate : new Date(orderDate) || prvData?.orderDate,
            orderStatus: orderStatus === 'undefined' ? prvData.orderStatus : orderStatus || prvData?.orderStatus,
            sellingPrice: sellingPrice === 'undefined' ? prvData.sellingPrice : parseFloat(sellingPrice) || prvData?.sellingPrice,
            shippingStatus: shippingStatus === 'undefined' ? prvData.shippingStatus : shippingStatus || prvData?.shippingStatus,
            trackingNo: trackingNo === 'undefined' ? prvData.trackingNo : trackingNo || prvData?.trackingNo,
            userPaymentStatus: userPaymentStatus === 'undefined' ? prvData.userPaymentStatus : userPaymentStatus || prvData?.userPaymentStatus,
            webLink: webLink === 'undefined' ? prvData.webLink : webLink || prvData?.webLink,
            userId: userId === 'undefined' ? prvData.userId : +userId || prvData?.buyerId,
            rate: rate === 'undefined' ? prvData.rate : parseFloat(rate) || prvData?.rate,
            fee: fee === 'undefined' ? prvData.fee : parseFloat(fee) || prvData?.fee,
        }
        console.log("this is data", data);

        const updateOrder = await prisma.order.update({
            where: { id: +id },
            data: data
        })
        console.log("update order", updateOrder);
        const haveFile = !!req.file
        let uploadResult = {}
        const imgOrder = await prisma.productImage.findFirst({ where: { orderId: prvData.id } })
        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite: true,
                public_id: path.parse(req.file.path).name
            })
            fs.unlink(req.file.path)
            
            if (imgOrder) {
                if(imgOrder.image){
                    await cloudinary.uploader.destroy(publicId(imgOrder.image))
                }
            }
            const updateUrl = uploadResult.secure_url || "";
            console.log("url", updateUrl);
            
            if (imgOrder) {
                const newImg = await prisma.productImage.update({
                    where: {
                        id: imgOrder.id
                    },
                    data: {
                        image: updateUrl
                    }
                })
                return res.json(newImg)
            } else {
                console.log("no exist file");
                const newImg = await prisma.productImage.create({
                    data: {
                        image: updateUrl,
                        orderId: prvData.id
                    }
                })
                console.log(newImg);
                return res.json(newImg)
            }
        }
        return res.json("update complete")

    } catch (err) {
        next(err)
    }
}
