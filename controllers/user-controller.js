const db = require('../db/index').connection
const jwt = require('jsonwebtoken')
const random = require('random-string-generator')
const key = process.env.SECRET
const hash = require('../services/crypto')
const UserService = require('../services/user-service')
const TokenService = require('../services/token-service')

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

    async getPhoto(req, res){
        var id = req.query.id
        try{
            if(id == 'my_id'){
                var [err, results] = TokenService.checkTokenValid(req.headers.access_token)
                if(err) [err, results] = TokenService.checkTokenValid(req.headers.refresh_token)
                if(err) return res.status(401).send('Invalid tokens')
                id = results.id
            }
            const result = await UserService.getPhoto(id)
            res.send(result)
        } catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async getProfileSmallInfo(req, res){
        const id = req.query.id
        try{
            const docs = await UserService.getProfileSmallInfo(id)
            res.send(docs)
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

}

module.exports = new User()