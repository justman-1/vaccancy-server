const VacancyService = require('../services/vacancy-service')

class Vacancy{

    async save(req, res){
        const data = req.data
        const id = req.id
        try{
            const result = await VacancyService.save(id, data)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async get(req, res){
        const id = req.query.id
        const refreshToken = req.headers['refresh_token']
        try{
            const result = await VacancyService.get(id, refreshToken)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async change(req, res){
        const data = req.data
        const id = req.id
        try{
            const result = await VacancyService.change(id, data)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async delete(req, res){
        const data = req.body
        const id = req.id
        try{
            const result = await VacancyService.delete(id, data)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

    async getSome(req, res){
        const data = req.data
        try{
            const result = await VacancyService.getSome(data.index, data.filters, data.request, data.date)
            res.send(result)
        }catch(err){
            console.log(err)
            res.status(err.status).send(err.text)
        }
    }

}

module.exports = new Vacancy()