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

class ProfileService{

    async getPhoto(id){
        const conn = await db.connectionPromise()
        const cacheResult = await CacheService.getHeaderInfo(id)
        console.log(cacheResult)
        if(cacheResult) return cacheResult

        var [docs] = await conn.query(`SELECT photo FROM users WHERE id = "${id}"`)
        
        if(docs == undefined){
            throw new ErrorApi(500, 'Ошибка сервера')
        }
        else if(docs.length == 0){
            throw new ErrorApi(401, 'Нет пользователей с таким ID')
        }
        else if(docs.length != 0){
            let result = {
                content: docs[0].photo,
                id: id
            }
            CacheService.setHeaderInfo(id, result)
            return result
        }
    }

    async getInfo(id){
        try{
            const conn = await db.connectionPromise()
            const [user] = await conn.query(`SELECT photo, login, resume, vacancies FROM users WHERE id = "${id}"`)
            if(user.length != 0){
                var resume = null
                var vacancies = []
                console.log(JSON.parse(user[0].vacancies))
                if(user[0].resume){
                    const [resumeInfo] = await conn.query(`SELECT * FROM resumes WHERE id = "${id}"`)
                    if(resumeInfo.length != 0) resume = resumeInfo[0]
                }
                if(JSON.parse(user[0].vacancies).length != 0){
                    console.log(1)
                    let dataVacancies = JSON.parse(user[0].vacancies)
                    await new Promise(async (resolve, reject)=>{
                        for(let i=0; i<dataVacancies.length; i++){
                            console.log(2)
                            const [vacancyInfo] = await conn.query(`SELECT id, position, salary, city FROM vacancies WHERE id = "${dataVacancies[i]}"`)
                            console.log(vacancyInfo)
                            if(vacancyInfo.length != 0) vacancies.push(vacancyInfo[0])
                            if(i == dataVacancies.length - 1) resolve(vacancies)
                        }
                    })
                    console.log(3)
                }
                return {
                    login: user[0].login,
                    photo: user[0].photo,
                    resume: resume,
                    vacancies: vacancies,
                }
            }
            else{
                throw new ErrorApi(410, 'Нет пользователей с таким ID')
            }
        }catch(err){
            if(err.status && err.text){
                throw new ErrorApi(err.status, err.text)
            }
            else{
                throw new ErrorApi(500, 'Ошибка сервера') 
            }
        }
    }

    async getSomeInfoForChange(id){
        try{
            const conn = await db.connectionPromise()
            const [data] = await conn.query(`SELECT email, login, photo FROM users WHERE id = "${id}"`)
            return data[0]
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }  
    }

    async saveInfo(data, id){
        try{
            const conn = await db.connectionPromise()
            const [users1] = await conn.query(`SELECT email FROM users WHERE id = "${id}"`)
            const [users2] = await conn.query(`SELECT email FROM users WHERE email = "${data.email}"`)
            if(users1.length != 0 && users1[0].email != data.email){
                if(users2.length > 0){
                    throw new ErrorApi(410, 'Эта почта занята')
                }
            }
            var photoName = false
            if(data.photo != undefined){
                photoName = uuid.v4() + data.photo
                data.photo = photoName
                await CacheService.setHeaderInfo(id, {
                    content: photoName,
                    id: id
                })
                const [users] = await conn.query(`SELECT photo FROM users WHERE id = "${id}"`)
                if(users[0].photo != 'null' || users[0].photo != null){
                    fs.unlink('photoes/' + users[0].photo, ()=>{})
                }
            }
            var sqlPart = ''
            for(let prop in data){
                sqlPart = sqlPart + ` ${prop} = "${data[prop]}",`
            }
            sqlPart = sqlPart.slice(0, sqlPart.length - 1)
            await conn.query(`UPDATE users SET ${sqlPart} WHERE id = "${id}"`)
            return {
                photoName: photoName
            }
        }catch(err){
            console.log(err)
            if(err.status && err.text){
                throw new ErrorApi(err.status, err.text)
            }
            else{
                throw new ErrorApi(500, 'Ошибка сервера')
            }
        }
    }
}

module.exports = new ProfileService()