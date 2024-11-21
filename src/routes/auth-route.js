const express = require('express')
const router = express.Router()
const authControl = require('../controllers/auth-controller')
const { registerValidate } = require('../middlewares/joi')


//route to controller
router.post('/register', registerValidate, authControl.register)
router.post('/login',authControl.login)
router.get('/verification/:token',authControl.verification)
router.post('/forget-password',authControl.forgetPassword)
router.patch('/resetPass',authControl.resetPass)



module.exports = router;