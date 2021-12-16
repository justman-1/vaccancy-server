const express = require('express')
const router = express.Router()
const User = require('../controllers/user-controller')
const Auth = require('../middlewares/auth')
const Validator = require('../middlewares/validator')
const multer = require('multer')
const Multer = require('../multer/index')

router.post('/register', Validator.registerValidate, User.register)
router.post('/signin', User.signin)
router.get('/getPhoto', User.getPhoto)
router.get('/getProfileSmallInfo', User.getProfileSmallInfo)
router.post('/saveResume', Auth.checkTokens, Validator.validate, User.saveResume)
router.post('/saveImage', Auth.checkTokens, User.saveImage)
router.get('/getImage/:name', User.getImage)

module.exports = router