const express = require('express')
const auth = require('../middleware/auth')
const multerConfig = require('../middleware/multer-config')
const router = express.Router()

const sauceCtrl = require('../controllers/sauce')

router.get('/', auth, sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/', auth, multerConfig, sauceCtrl.createSauce)
router.post('/:id/like', auth, sauceCtrl.postSauce)

module.exports = router