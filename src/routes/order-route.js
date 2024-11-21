const express = require('express')
const router = express.Router()
const orderControl = require('../controllers/order-controller')
const upload = require('../middlewares/upload')



router.get('/all',orderControl.getAll)
router.post('/add',upload.single('image'),orderControl.addOrder)
router.delete('/delete/:id',orderControl.deleteOrder)

module.exports = router;
