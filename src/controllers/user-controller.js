const createError = require('../utility/createError')
const prisma = require('../model/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinary')
const fs = require('fs/promises')
const path = require('path')
const publicId = require('../utility/getPublicId')

    exports.infromation = (req, res, next) => {
    try {
        const user = req.user
        res.json({ user: user })
    } catch (err) {
        next(err)
    }
    },

    exports.editInfo = async (req, res, next) => {
        try {
            const user = req.user
            const body = req.body
            if (Object.keys(body).length == 0) {
                res.json("no update")
            }
            const updateData = {}
            for (let key in body) {
                if (user.hasOwnProperty(key) && body[key].trim() !== "") {
                    updateData[key] = body[key]
                }
            }
            const updated = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: updateData,
            })
            res.json(updated)
        } catch (err) {
            next(err)
        }
    },

    exports.editProfileImg = async (req, res, next) => {
        try {
            const user = req.user
            const haveFile = !!req.file
            let uploadResult = {}
            const profileData = await prisma.user.findFirst({where: {id:user.id}})

            console.log("have file", req.file)
            if (haveFile) {
                uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    overwrite: true,
                    public_id: path.parse(req.file.path).name
                })
                fs.unlink(req.file.path)
            if(profileData.profileImage){
                await cloudinary.uploader.destroy(publicId(profileData.profileImage))
            }
            }
            console.log(uploadResult.secure_url)
            const updateData = uploadResult.secure_url || "";
            console.log("update data",updateData)
            const updated = await prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    profileImage: updateData
                }
            })
            res.json(updated)

        } catch (err) {
            next(err)
        }
    }

    exports.getAll = async (req,res,next) =>{
        try {
            const user = req.user
            if(!user){
                return createError(401,"Unauthorized")
            }
            if(user.role!=="ADMIN"){
                return createError(401,"Unauthorized")
            }
            const allUsers = await prisma.user.findMany({
                orderBy:{id:'asc'},
                select:{
                    firstName:true,
                    lastName:true,
                    email:true,
                    phone:true,
                    address:true,
                    profileImage:true, 
                    id:true

                }
            })
            res.json(allUsers)
        } catch (err) {
            next(err)
        }
    }

  

 

