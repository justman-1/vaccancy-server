const db = require('../db/index')
const TokenService = require('../services/token-service')

class Validator{

    constructor(){
        this.validate = this.validate.bind(this)
        this.registerValidate = this.registerValidate.bind(this)
        this.changeResumeValidate = this.changeResumeValidate.bind(this)
        this.validateVacancy = this.validateVacancy.bind(this)
        this.validateFunc = this.#validateFunc.bind(this)
        this.validateResumeFunc = this.#validateResumeFunc.bind(this)
        this.validateVacancyFunc = this.#validateVacancyFunc.bind(this)
    }

    validate(req, res, next){
        if(req.query != undefined && req.query != null && JSON.stringify(req.query) != '{}'){
            const data = req.query
            this.#validateFunc(req, res, next, data)
        }
        else if(req.body != undefined && req.body != null && JSON.stringify(req.body) != '{}'){
            const data = req.body
            this.#validateFunc(req, res, next, data)
        }
        else if(JSON.stringify(req.body) == '[]' || JSON.stringify(req.query) == '[]'){
            res.status(410).send('Данные не передались')
        }
    }

    registerValidate(req, res, next){
        const data = req.body
        const login = data.login
        const password = data.password
        const email = data.email
        if(login.replace(/\s/g, '') == '' || password.replace(/\s/g, '') == '' || email.replace(/\s/g, '') == ''){
            res.status(410).send('Заполните все поля')
        }
        else if(email.slice(-10) != '@gmail.com'){
            res.status(410).send('Почта должна заканчиваться на @gmail.com')
        }
        else{
            next()
        }
    }

    changeResumeValidate(req, res, next){
        if(req.query != undefined && req.query != null && JSON.stringify(req.query) != '{}'){
            const data = req.query
            this.#validateResumeFunc(req, res, next, data)
        }
        else if(req.body != undefined && req.body != null && JSON.stringify(req.body) != '{}'){
            const data = req.body
            this.#validateResumeFunc(req, res, next, data)
        }
        else if(JSON.stringify(req.body) == '[]' || JSON.stringify(req.query) == '[]'){
            res.status(410).send('Данные не передались')
        }
    }

    validateVacancy(req, res, next){
        if(req.query != undefined && req.query != null && JSON.stringify(req.query) != '{}'){
            const data = req.query
            this.#validateVacancyFunc(req, res, next, data)
        }
        else if(req.body != undefined && req.body != null && JSON.stringify(req.body) != '{}'){
            const data = req.body
            this.#validateVacancyFunc(req, res, next, data)
        }
        else if(JSON.stringify(req.body) == '[]' || JSON.stringify(req.query) == '[]'){
            res.status(410).send('Данные не передались')
        }
    }

    validateVacanciesGet(req, res, next){
        if(req.query != undefined && req.query != null && JSON.stringify(req.query) != '{}'){
            const data = req.query
            if(data.date){
                req.data = data
                next()
            }
            else res.status(410).send('Данные не передались')
        }
        else if(req.body != undefined && req.body != null && JSON.stringify(req.body) != '{}'){
            const data = req.body
            if(data.date){
                req.data = data
                next()
            }
            else res.status(410).send('Данные не передались')
        }
        else{
            console.log(req.body)
            console.log(req.query)
            res.status(410).send('Данные не передались')
        }
    }

    #validateFunc(req, res, next, data){
        var err = null
        for(let prop in data){
            console.log(data)
            if(data[prop] == null || typeof(data[prop]) == 'string' && data[prop].trim() == ''){
                err = true
            }
            else{
                if(typeof(data[prop]) == String){
                    data[prop] = data[prop].trim()
                }
                else{
                    data[prop] = data[prop]
                }
            }
        }
        if(err){
            return res.status(410).send('Заполните все поля')
        }
        req.data = data
        next()
    }

    #validateResumeFunc(req, res, next, data){
        var props = 0
        var result = {}
        console.log(data)
        if(data.email && data.email.slice(-10) != '@gmail.com'){
            return res.status(410).send('Почта должна заканчиваться на @gmail.com')
        }
        for(let prop in data){
            if(data[prop] != null && data[prop].trim() == ''){
                return res.status(410).send('Заполните все поля')
            }
            else if(data[prop] != null && data[prop].trim() != ''){
                result[prop] = data[prop].trim()
                props = props + 1
            }
        }
        console.log(result)
        if(props == 0){
            return res.send({
                photoName: false,
                accessToken: req.accessToken,
                refreshToken: req.refreshToken
            })
        }
        req.data = result
        next()
    }

    #validateVacancyFunc(req, res, next, data){
        var err = null
        console.log(data)
        for(let prop in data){
            if(data[prop] == null || typeof(data[prop]) == 'string' && data[prop].trim() == ''){
                if(prop != 'address' &&  prop != 'coords'){
                    err = true
                }
            }
            else{
                console.log(typeof(data[prop]))
                if(typeof(data[prop]) == 'string'){
                    data[prop] = data[prop].trim()
                }
                else{
                    data[prop] = data[prop]
                }
            }
        }
        if(err){
            return res.status(410).send('Заполните все поля')
        }
        req.data = data
        next()
    }

}

module.exports = new Validator()