const Joi = require('joi')
const createError = require('../utility/createError')

const register = Joi.object({

    firstName:Joi
    .string()
    .required()
    .messages({"string.empty":"First Name is required"}),

    lastName:Joi
    .string()
    .required()
    .messages({"string.empty":"Last Name is required"}),
    
    email:Joi
    .string()
    .email({tlds:true}),
    
    phone:Joi
    .string(),

    address:Joi
    .string(),
       
    password:Joi
    .string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{6,20}$'))
    .required()
    .messages({
        "string.empty":"Password is required",
        "string.pattern.base" : "Password must contain at least one of a-z A-Z 0-9 and mustbe 6-20 characters!!"
    }),

    confirmPassword:Joi
    .string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
        "string.empty" : "Confirm password is required",
        "any.only":"password and confirm password not match"
    }),

})

const validateScheme = (schema) =>(req,res,next)=>{
    const {value,error} = schema.validate(req.body)
    console.log(error)
    if(error){
        return createError(400,error.details[0].message)
    }
    req.input = value
    next();
}

module.exports.registerValidate = validateScheme(register)