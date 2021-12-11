const hashing = require('object-hash')

function hash(text){
    const hashedText = hashing(text)
    return hashedText
}

module.exports = hash