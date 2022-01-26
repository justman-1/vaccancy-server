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

class VacancyService{

    async save(id, data){
        try{
            const conn = await db.connectionPromise()
            const vacId = uuid.v4()
            data.id = vacId
            data.coords = JSON.stringify(data.coords)
            console.log(id)
            const [vacancyIds] = await conn.query(`SELECT vacancies FROM users WHERE id = "${id}"`)
            console.log(vacancyIds)
            var ids = JSON.parse(vacancyIds[0].vacancies)
            ids.push(vacId)
            ids = JSON.stringify(ids)
            await conn.query(`UPDATE users SET vacancies = '${ids}' WHERE id ="${id}"`)
            await conn.query(`INSERT INTO vacancies (id, position,
             salary, company, experience, company_activity, activity, 
             requirements, conditions, skills, city, address, date, 
             coordinates) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
             ?, ?, ?)`, [data.id, data.position, 
             data.salary, data.company, data.experience, 
             data.companyActivity, data.activity, data.requirements, 
             data.conditions, data.skills, data.city, 
             data.address, data.date, data.coords])

            return {
                result: 'ok'
            }
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }
    }

    async get(id){
        try{
            const conn = await db.connectionPromise()
            console.log(id)
            const [vacancies] = await conn.query(`SELECT * FROM vacancies WHERE id = "${id}"`)
            console.log(vacancies)
            vacancies[0].coords = JSON.parse(vacancies[0].coordinates)
            if(vacancies.length != 0) return { data: vacancies[0] }
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }
    }

    async change(id, data){
        try{
            const conn = await db.connectionPromise()
            var [vacancyIds] = await conn.query(`SELECT vacancies FROM users WHERE id = "${id}"`)
            if(vacancyIds.length != 0){
                let ids = JSON.parse(vacancyIds[0].vacancies)
                console.log(ids)
                const findIdResult = ids.find((e)=>{
                    if(e == data.id) return id
                })
                if(findIdResult == undefined) throw new ErrorApi(411, 'Вы не имеете права изменять эту вакансию')
            }
            else if(vacancyIds.length == 0){
                throw new ErrorApi(411, 'Ошибка')
            }
            data.coordinates = JSON.stringify(data.coords)
            data.company_activity = data.companyActivity
            var sqlPart = ''
            for(let prop in data){
                if(prop != 'coords' && prop != 'companyActivity') sqlPart = sqlPart + ` ${prop} = '${data[prop]}',`
            }
            sqlPart = sqlPart.slice(0, sqlPart.length - 1)
            await conn.query(`UPDATE vacancies SET ${sqlPart} WHERE id = '${data.id}'`)
            return {
                result: 'ok'
            }
        }catch(err){
            if(err.status && err.text){
                throw new ErrorApi(err.status, err.text)
            }
            else{
                console.log(err)
                throw new ErrorApi(500, 'Ошибка сервера')
            }
        }
    }

    async delete(id, data){
        try{
            const conn = await db.connectionPromise()
            const [vacancyIds] = await conn.query(`SELECT vacancies FROM users WHERE id = "${id}"`)
            if(vacancyIds.length != 0){
                const ids = JSON.parse(vacancyIds[0].vacancies)
                var result = ids.find(e=>{ if(e == data.id) return true })
                if(result != undefined){
                    result = ids.filter(e=>{
                        if(e != data.id) return true
                    })
                    await conn.query(`UPDATE users SET vacancies = ? WHERE id = ?`, [JSON.stringify(result), id])
                    await conn.query(`DELETE FROM vacancies WHERE id = ?`, [data.id])
                }
            }
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }
    }

    async getSome(index, filters){
        try{
            const conn = await db.connectionPromise()
            
        }catch(err){
            console.log(err)
            throw new ErrorApi(500, 'Ошибка сервера')
        }
    }

}

module.exports = new VacancyService()