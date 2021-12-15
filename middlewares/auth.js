const db = require('../db/index')
const TokenService = require('../services/token-service')
const Validator = require('./validator')

class Auth{

    constructor () {
        this.checkTokens = this.checkTokens.bind(this)
        this.checkRefreshToken = this.checkRefreshToken.bind(this)
    }

    checkTokens(req, res, next){
        const refreshToken = req.headers.refresh_token
        const accessToken = req.headers.access_token
        var err = Validator.validateTokens(refreshToken, accessToken)
        
        if(err) return res.status(401).send('No tokens')

        var [err, docs] = TokenService.checkTokenValid(accessToken)//check accessToken

        if(err) this.checkRefreshToken(req, res, next, refreshToken)
        else{
            req.refreshToken = refreshToken
            req.accessToken = accessToken
            next()
        }
    }

    async checkRefreshToken(req, res, next, token){
        var [err, docs] = TokenService.checkTokenValid(token)//check refreshToken

        if(err) console.log(err)
        else{
            const id = docs.id
            const accessToken = TokenService.generateAccessToken(id)
            const conn = await db.connectionPromise()
            await conn.query(`UPDATE users SET accessToken = "${accessToken}" WHERE id = "${id}"`)
            req.id = id
            req.refreshToken = token
            req.accessToken = accessToken
            next()
        }
    }

}

module.exports = new Auth()