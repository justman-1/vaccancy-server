const fs = require('fs')
const db = require('../db/index')
const jwt = require('jsonwebtoken')
const random = require('random-string-generator')
const key = process.env.SECRET
const hash = require('./crypto')
const ErrorApi = require('./error-service')
const TokenService = require('./token-service')
const CacheService = require('./cache-service')
const uuid = require('uuid')

class UserService{

    async register(login, email, password){
        const conn = await db.connectionPromise()
        var [docs] = await conn.query(`SELECT email FROM users WHERE email = "${email}"`)

        if(docs.length == 0){
            const id = random(20, 'alphanumeric')
            const refreshToken = TokenService.generateRefreshToken(id)
            const accessToken = TokenService.generateAccessToken(id)
            var password = hash(password)
            const results = await conn.query(`INSERT INTO users 
            (login, email, id, password, accessToken, refreshToken) 
            VALUES(?, ?, ?, ?, ?, ?)`, [login, email, id, password, accessToken, refreshToken])
            return({
                accessToken: accessToken,
                refreshToken: refreshToken,
                id: id
            })
        }
        else{
            throw new ErrorApi(410, 'Эта почта уже занята')
        }
    }

    async signin(email, password){
        if(email.replace(/\s/g, '') == '' || password.replace(/\s/g, '') == ''){
            throw new ErrorApi(410, 'Заполните все поля')
        }
        const conn = await db.connectionPromise()
        var [docs] = await conn.execute(`SELECT password, accessToken, refreshToken, id FROM users WHERE email = "${email}"`)

        if(docs.length == 0){
            throw new ErrorApi(410, 'Нет пользователей с такой почтой')
        }
        else if(docs[0].password != password){
            throw new ErrorApi(410, 'Неправильный пароль')
        }
        else if(docs[0].password == password){
            var [err1, results1] = TokenService.checkTokenValid(docs[0].refreshToken)//check refreshToken
            var [err2, results2] = TokenService.checkTokenValid(docs[0].accessToken)//check accessToken
            if(err1){//if refreshToken is invalid
                docs[0].refreshToken = TokenService.generateRefreshToken(docs[0].id)
                const [result] = await conn.query(`UPDATE users SET refreshToken = "${docs[0].refreshToken}" WHERE email = "${email}"`)
            }
            if(err2){//if accessToken is invalid
                docs[0].accessToken = TokenService.generateAccessToken(docs[0].id)
                const [result] = await conn.query(`UPDATE users SET accessToken = "${docs[0].accessToken}" WHERE email = "${email}"`)
            }
            return({
                accessToken: docs[0].accessToken,
                refreshToken: docs[0].refreshToken,
                id: docs[0].id
            })
        }
    }

}

module.exports = new UserService()