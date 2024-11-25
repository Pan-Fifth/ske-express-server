require('dotenv').config();
const createError = require('../utility/createError')
const prisma = require('../model/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    console.log(user);
    if (user) {
      return createError(400, "email already exist")
    }
    const hashPass = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data:{
        firstName:firstName,
        lastName:lastName,
        email:email,
        phone:phone,
        address:address,
        password:hashPass
      }
    })
    const token = jwt.sign({user:newUser.id},process.env.JWT_SECRET,{expiresIn:"1d"})
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    const verificationLink =`${process.env.BASE_URL}/auth/verification/${token}`
    
    await transporter.sendMail({
      to: email,
      subject: "Email Verification by SK EXPRESS",
      // text: "Please verify your email by clicking on this link: ",
      html: `<p>Please verify by clicking the following link : </p> <a href=${verificationLink} target="_blank" rel="noopener noreferrer">Click this link</a>`,
    });
    res.json({message:"verification email has been sent to your email!!"})
  } catch (err) {
    next(err)
  }
},

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    })
    if (!user || user.isVerify !== true) {
      return createError(404, "please verify your email")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return createError(404, "email or password is wrong")
    }
    const payload = {
      id: user.id,
      name: user.firstName,
      role: user.role
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.json({ user: payload, token: token })
  } catch (err) {
    next(err)
  }
},

exports.verification =async(req,res,next)=>{
  try {
    const {token} = req.params
    const headers = jwt.verify(token,process.env.JWT_SECRET)
    if(!headers){
     return createError(404,"token missing")
    }
    const user = await prisma.user.findFirst({
      where:{id:headers.user}
    })
    console.log(user)
    if(!user){
     return createError(404,"user not existed")
    }
    const verify = await prisma.user.update({
      where:{
        id:headers.user
      },
      data:{
        isVerify: true
      }
    })
    // res.json({message:"account has been verified",redirectUrl:"https://localhost:5173/login" })
    res.redirect(`${process.env.FRONTEND_URL}/login`)
  } catch (err) {
    next(err)
  }
},

exports.forgetPassword = async (req,res,next)=>{
try {
  const {email} = req.body
  const user = await prisma.user.findFirst({
    where:{email:email}
  })
  if(!user){
    return createError(404,"Email not found")
  }
  const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn: "1d"})
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  const verificationLink =`${process.env.FRONTEND_URL}/reset-password/${token}`
  
  await transporter.sendMail({
    to: email,
    subject: "Email Verification by SK EXPRESS",
    text: `Please change your password by clicking on this link: ${verificationLink}`
  })
  res.json({message:"reset-Password email has been sent"})
} catch (err) {
  next(err)
}
},

exports.resetPass = async(req,res,next)=>{
  try {
      const {token,password} = req.body
      const headers = jwt.verify(token,process.env.JWT_SECRET)
    if(!headers){
     return createError(404,"token missing")
    }
    const user = await prisma.user.findFirst({
      where:{id:headers.id}
    })
    if(!user){
     return createError(404,"user not existed")
    }
    const hashPassword = await bcrypt.hash(password,10)
    const resetPass = await prisma.user.update({
      where:{id:user.id},data:{password:hashPassword}
    })
    res.json({message:"reset password complete"})
  } catch (err) {
      next(err)
  }
}