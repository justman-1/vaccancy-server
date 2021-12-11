const mysqlPromise = require('mysql2/promise')
const mysql = require('mysql2')

class Db{
    constructor(){
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: "vacancy",
            password: ""
        })
        this.connection = connection
    }
    async connectionPromise(){
        const connectionPromise = await mysqlPromise.createConnection({
            host: "localhost",
            user: "root",
            database: "vacancy",
            password: ""
        })
        return connectionPromise
    }
}

module.exports = new Db()