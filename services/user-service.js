const db = require('../db/index')
const jwt = require('jsonwebtoken')
const random = require('random-string-generator')
const key = process.env.SECRET
const hash = require('./crypto')
const ErrorApi = require('./error-service')
const TokenService = require('./token-service')

class UserService{

    async register(login, email, password){
        if(login.replace(/\s/g, '') != '' && password.replace(/\s/g, '') != '' && email.replace(/\s/g, '') != ''){
            if(email.slice(-10) == '@gmail.com'){
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
            else{
                throw new ErrorApi(410, 'Почта должна заканчиваться на @gmail.com')
            }
        }
        else{
            throw new ErrorApi(410, 'Заполните все поля')
        }
    }

    async signin(email, password){
        if(email.replace(/\s/g, '') == '' || password.replace(/\s/g, '') == ''){
            throw new ErrorApi(402, 'Заполните все поля')
        }
        const conn = await db.connectionPromise()
        var [docs] = await conn.execute(`SELECT password, accessToken, refreshToken, id FROM users WHERE email = "${email}"`)

        if(docs.length == 0){
            throw new ErrorApi(402, 'Нет пользователей с такой почтой')
        }
        else if(docs[0].password != password){
            throw new ErrorApi(402, 'Неправильный пароль')
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

    async getPhoto(id){
        const conn = await db.connectionPromise()
        var [docs] = await conn.query(`SELECT photo FROM users WHERE id = "${id}"`)
        
        if(docs == undefined){
            throw new ErrorApi(500, 'Ошибка сервера')
        }
        else if(docs.length != 0 && docs[0].photo == null){
            return({
                content: 'null',
                id: id
            })
        }
        else if(docs.length != 0 && docs[0].photo != null){

        }
    }

    async getProfileSmallInfo(id){
        const conn = await db.connectionPromise()
        const [docs] = await conn.query(`SELECT photo, login FROM users WHERE id = "${id}"`)
        if(docs != undefined || docs.length != 0){
            var photo = docs[0].photo
            return {
                login: docs[0].login,
                photo: photo
            }
        }
        else{
            throw new ErrorApi(410, 'Нет пользователей с таким ID')
        }
    }

}

module.exports = new UserService()