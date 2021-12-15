const multer = require('multer')
const uuid = require('uuid')

class Multer{
    constructor(){
        this.photoStorage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'photoes')
            },
            filename: function (req, file, cb) {
              const photoName = req.headers['photoname']
              req.photoName = photoName
              cb(null, photoName)
            }
          })
    }
}

module.exports = new Multer()