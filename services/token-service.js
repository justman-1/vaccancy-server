const jwt = require('jsonwebtoken')
const random = require('random-string-generator')

class Token{

    checkTokenValid(token){
        let response;
        jwt.verify(token, process.env.SECRET, (err, docs)=>{
            if(err) response = [err, null]
            else{
                response = [null, docs]
            }
        })
        return response
    }

    generateAccessToken(id){
        const token = jwt.sign({ id: id, random: random(10, 'alphanumeric') }, process.env.SECRET, {expiresIn: '10m'})
        return token
    }

    generateRefreshToken(id){
        const token = jwt.sign({ id: id, random: random(10, 'alphanumeric') }, process.env.SECRET, {expiresIn: '30d'})
        return token
    }

}

module.exports = new Token()