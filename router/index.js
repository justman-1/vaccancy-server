const express = require('express')
const router = express.Router()
const User = require('../controllers/user-controller')
const Auth = require('../middlewares/auth')

router.post('/register', User.register)
router.post('/signin', User.signin)
router.get('/getPhoto', User.getPhoto)
router.get('/getProfileSmallInfo', User.getProfileSmallInfo)

module.exports = router