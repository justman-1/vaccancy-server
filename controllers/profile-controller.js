const multer = require('multer')
const fs = require('fs')
const ProfileService = require('../services/profile-service')
const Multer = require('../multer/index')
const uploadPhoto = multer({storage: Multer.photoStorage}).single("photo")

class Profile{
    async getPhoto(req, res){
        var id = req.id
        try{
            const result = await ProfileService.getPhoto(id)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        } catch(err){
            res.status(err.status).send(err.text) 
        }
    }

    async getInfo(req, res){
        const id = req.query.id
        try{
            const docs = await ProfileService.getInfo(id)
            res.send(docs)
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    saveImage(req, res){
        uploadPhoto(req, res, (err)=>{
            console.log(req.photoName)
            if(err) return res.status(500).send('Ошибка загрузки фото на сервер')

            return res.send('ok')
        })
    }

    getImage(req, res){
        const photoName = req.params.name
        const exists = fs.existsSync('photoes/' + photoName)
        if(exists == false) return res.status(410).send('No image')
        const stream = fs.createReadStream('photoes/' + photoName)
        stream.pipe(res)
    }

    async getSomeInfoForChange(req, res){
        const id = req.id
        try{
            const result = await ProfileService.getSomeInfoForChange(id)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async saveInfo(req, res){
        const data = req.data
        const id = req.id
        console.log(id)
        console.log(data)
        try{
            const result = await ProfileService.saveInfo(data, id)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

}
module.exports = new Profile()