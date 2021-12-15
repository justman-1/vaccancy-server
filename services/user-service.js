const fs = require('fs')
const db = require('../db/index')
const jwt = require('jsonwebtoken')
const random = require('random-string-generator')
const key = process.env.SECRET
const hash = require('./crypto')
const ErrorApi = require('./error-service')
const TokenService = require('./token-service')
const uuid = require('uuid')

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

    async getPhoto(id){
        const conn = await db.connectionPromise()
        var [docs] = await conn.query(`SELECT photo FROM users WHERE id = "${id}"`)
        
        if(docs == undefined){
            throw new ErrorApi(500, 'Ошибка сервера')
        }
        else if(docs.length == 0){
            throw new ErrorApi(401, 'Нет пользователей с таким ID')
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
        const [docs] = await conn.query(`SELECT photo, login, resume, vacancies FROM users WHERE id = "${id}"`)
        if(docs != undefined && docs.length != 0){
            return {
                login: docs[0].login,
                photo: docs[0].photo,
                resume: docs[0].resume,
                vacancies: docs[0].vacancies,
            }
        }
        else{
            throw new ErrorApi(410, 'Нет пользователей с таким ID')
        }
    }

    async saveResume(data, id){
        try{
            const photoName = uuid.v4() + data.photo
            const conn = await db.connectionPromise()
            const [vacancy] = await conn.query(`SELECT photo FROM resumes WHERE id = "${id}"`)

            if(vacancy.length > 0){
                console.log(vacancy[0].photo)
                fs.unlink('photoes/' + vacancy[0].photo, ()=>{})
                await conn.query(`UPDATE resumes SET position = "${data.position}", FIO = "${data.FIO}",
                born = "${data.born}", city = "${data.city}", contacts = "${data.contacts}", 
                experience = "${data.experience}", education = "${data.education}", languages = "${data.languages}",  
                skills = "${data.skills}", description = "${data.description}", photo = "${photoName}" WHERE id = "${id}"`)
                return {
                    photoName: photoName
                }
            }
            await conn.query(`INSERT INTO resumes (position, FIO, born, city, contacts, experience, education, 
                languages, skills, description, photo, id) VALUES("${data.position}", "${data.FIO}", 
                "${data.born}", "${data.city}", "${data.contacts}", "${data.experience}", "${data.education}", "${data.languages}", 
                "${data.skills}", "${data.description}", "${photoName}", "${id}")`)
            return {
                photoName: photoName
            }
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }
        
    }

}

module.exports = new UserService()