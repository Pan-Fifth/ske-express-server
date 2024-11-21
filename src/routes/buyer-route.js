const express = require('express')
const router = express.Router()
const buyerControl = require('../controllers/buyer-controller')
const upload = require('../middlewares/upload')

router.post('/add',buyerControl.addBuyer)
router.get('/allActive',buyerControl.allActiveBuyer)
router.get('/all',buyerControl.allBuyer)
router.patch('/edit',upload.single("buyer"),buyerControl.editBuyer)


module.exports = router;
