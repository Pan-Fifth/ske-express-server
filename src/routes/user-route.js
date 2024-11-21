const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-controller')
const autenticate = require('../middlewares/authenticate')
const upload = require('../middlewares/upload')


router.get('/info',userControl.infromation)
router.patch('/edit',userControl.editInfo)
router.put('/edit',upload.single("profileImage"),userControl.editProfileImg)
router.get("/all",userControl.getAll)

module.exports = router;
