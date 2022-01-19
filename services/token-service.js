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

    async checkTokensId(refreshToken, accessToken){

        jwt.verify(refreshToken, process.env.SECRET, (err, docs)=>{
            if(err) return ['accessToken', null]

            const accessTokenId = docs.id
            jwt.verify(accessToken, process.env.SECRET, (err, docs)=>{
                if(err) return ['refreshToken', null]

                const refreshTokenId = docs.id
                const result = (refreshTokenId == accessTokenId)
                return [null, result]
            })
        })
    }

}

module.exports = new Token()