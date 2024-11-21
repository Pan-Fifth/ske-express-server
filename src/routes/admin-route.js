const express = require('express')
const router = express.Router()
const adminControl = require('../controllers/admin-controller')
const upload = require('../middlewares/upload')

router.get('/adminGetAllOrders',adminControl.getAllOrders)
router.patch('/editOrder',upload.single('image'),adminControl.editOrder)
// router.get('/getenum',adminControl.getEnum)


module.exports = router;
