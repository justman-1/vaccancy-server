const db = require('../db/index')
const TokenService = require('../services/token-service')

class Validator{

    constructor(){
        this.validateFunc = this.validateFunc.bind(this)
        this.validate = this.validate.bind(this)
    }

    validate(req, res, next){
        if(req.query != undefined && req.query != null && JSON.stringify(req.query) != '{}'){
            const data = req.query
            this.validateFunc(req, res, next, data)
        }
        else if(req.body != undefined && req.body != null && JSON.stringify(req.body) != {}){
            const data = req.body
            this.validateFunc(req, res, next, data)
        }
    }

    validateFunc(req, res, next, data){
        var err = null
        for(let prop in data){
            if(data[prop].replace(/\s/g, '') == '' || data[prop].replace(/\s/g, '') == null){
                err = true
            }
            
        }
        if(err){
            return res.status(410).send('Заполните все поля')
        }
        req.data = data
        next()
    }

    validateTokens(refreshToken, accessToken){
        if(refreshToken == undefined ||
           refreshToken == null ||
           accessToken == undefined ||
           accessToken == null){
               return 'No token'
        }
        return null
    }

}

module.exports = new Validator()