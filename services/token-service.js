const jwt = require('jsonwebtoken')
const random = require('random-string-generator')

class Token{

    generateAccessToken(id){
        const token = jwt.sign({ id: id, random: random(10, 'alphanumeric') }, process.env.SECRET, {expiresIn: '10m'})
        return token
    }

    generateRefreshToken(id){
        const token = jwt.sign({ id: id, random: random(10, 'alphanumeric') }, process.env.SECRET, {expiresIn: '30d'})
        return token
    }

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

    validateTokens(refreshToken, accessToken){
        if(refreshToken == undefined ||
           refreshToken == null ||
           accessToken == undefined ||
           accessToken == null){
               return 'No token'
        }
        return null
    }

}

module.exports = new Token()