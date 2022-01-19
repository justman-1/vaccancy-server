const ResumeService = require('../services/resume-service')

class Resume{

    async save(req, res){
        const data = req.data
        const id = req.id
        try{
            const result = await ResumeService.save(data, id)
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
            const result = await ResumeService.change(data, id)
            res.send({...result,
                accessToken: req.accessToken, 
                refreshToken: req.refreshToken})
        }catch(err){
            res.status(err.status).send(err.text)
        }
    }

}
module.exports = new Resume()