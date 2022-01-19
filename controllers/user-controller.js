const hash = require('../services/crypto')
const UserService = require('../services/user-service')
const Multer = require('../multer/index')

class User{

    async register(req, res){
        const data = req.body
        try{
            const result = await UserService.register(data.login, data.email, data.password)
            console.log(result)
            res.send(result)
        } catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async signin(req, res){
        const email = req.body.email
        const password = hash(req.body.password)
        try{
            const result = await UserService.signin(email, password)
            res.send(result)
        } catch(err){
            res.status(err.status).send(err.text)
        }
    }

}
module.exports = new User()