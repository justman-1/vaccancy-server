const express = require('express')
const router = express.Router()
const Validator = require('../middlewares/validator')
const User = require('../controllers/user-controller')
const Profile = require('../controllers/profile-controller')
const Resume = require('../controllers/resume-controller')
const Vacancy = require('../controllers/vacancy-controller')
const Auth = require('../middlewares/auth')
const multer = require('multer')
const Multer = require('../multer/index')

router.post('/register', Validator.registerValidate, User.register)
router.post('/signin', User.signin)
router.get('/getPhoto', Auth.checkTokens, Profile.getPhoto)
router.get('/getProfileInfo', Profile.getInfo)
router.post('/saveResume', Auth.checkTokens, Validator.validate, Resume.save)
router.post('/changeResume', Auth.checkTokens, Validator.changeResumeValidate, Resume.change)
router.post('/saveImage', Auth.checkTokens, Profile.saveImage)
router.get('/getImage/:name', Profile.getImage)
router.get('/getProfileSomeInfoForChange', Auth.checkTokens, Profile.getSomeInfoForChange)
router.post('/saveProfileInfo', Auth.checkTokens, Validator.changeResumeValidate, Profile.saveInfo)
router.post('/saveVacancy', Auth.checkTokens, Validator.validateVacancy, Vacancy.save)
router.post('/changeVacancy', Auth.checkTokens, Validator.validateVacancy, Vacancy.change)
router.get('/getVacancy', Vacancy.get)
router.post('/deleteVacancy', Auth.checkTokens, Vacancy.delete)
router.get('/getVacancy', Validator.validateVacanciesGet, Vacancy.getSome)

module.exports = router