const NodeCache = require("node-cache")
const store = new NodeCache()

class Cache{

    setHeaderInfo(id, result){
        store.set('headerInfo_' + id, result)
    }

    getHeaderInfo(id){
        const result = store.get('headerInfo_' + id)
        if(result == undefined){
            return null
        }
        return result
    }
}

module.exports = new Cache()