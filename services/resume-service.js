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

class ResumeService{

    async save(data, id){
        try{
            const photoName = uuid.v4() + data.photo
            const conn = await db.connectionPromise()
            const [vacancy] = await conn.query(`SELECT photo FROM resumes WHERE id = "${id}"`)

            if(vacancy.length > 0){
                fs.unlink('photoes/' + vacancy[0].photo, ()=>{})
                await conn.query(`UPDATE users SET resume = "true" WHERE id ="${id}"`)
                await conn.query(`UPDATE resumes SET position = "${data.position}", FIO = "${data.FIO}",
                born = "${data.born}", city = "${data.city}", contacts = "${data.contacts}", 
                experience = "${data.experience}", education = "${data.education}", languages = "${data.languages}",  
                skills = "${data.skills}", description = "${data.description}", photo = "${photoName}" WHERE id = "${id}"`)
                return {
                    photoName: photoName
                }
            }
            await conn.query(`UPDATE users SET resume = "true" WHERE id ="${id}"`)
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

    async change(data, id){
        try{
            var photoName = false
            if(data.photo != undefined){
                photoName = uuid.v4() + data.photo
                data.photo = photoName
            }
            const conn = await db.connectionPromise()
            const [vacancy] = await conn.query(`SELECT photo FROM resumes WHERE id = "${id}"`)

            var sqlPart1 = ''

            if(vacancy.length > 0){
                for(let prop in data){
                    sqlPart1 = sqlPart1 + ` ${prop} = "${data[prop]}",`
                }
                sqlPart1 = sqlPart1.slice(0, sqlPart1.length - 1)
                if(data.photo != undefined){
                    fs.unlink('photoes/' + vacancy[0].photo, ()=>{})
                }
                await conn.query(`UPDATE users SET resume = "true" WHERE id ="${id}"`)
                await conn.query(`UPDATE resumes SET ${sqlPart1} WHERE id = "${id}"`)
                return {
                    photoName: photoName
                }
            }
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }  
    }

}

module.exports = new ResumeService()