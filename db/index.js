const mysqlPromise = require('mysql2/promise')
const mysql = require('mysql2')

class Db{

    constructor(){
        this.createDatabase = this.#createDatabase.bind(this)
        var vacancyConnection = mysql.createConnection({
            host: "localhost",
            user: "root",
            database: 'vacancy',
            password: ""
        })
        vacancyConnection.connect((err)=>{
            if(err){
                if(err.errno == 1049){//no database
                    this.#createDatabase()
                }
                else{
                    console.log('MYSQL SERVER DOESNT WORK')
                }
            }
            else{
                this.connection = vacancyConnection
            }
        })
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
    
    async #createDatabase(){
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: ""
        })
        connection.query('CREATE DATABASE vacancy', async (err, res)=>{
            if(!err){  
                var vacancyConnection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    database: 'vacancy',
                    password: ""
                })
                this.connection = vacancyConnection
                await new Promise((resolve, reject)=>{
                    this.connection.query(`
                    CREATE TABLE users(
                        login text,
                        email text,
                        id text,
                        password text,
                        accessToken text,
                        refreshToken text,
                        photo text DEFAULT null,
                        vacancies text DEFAULT '[]',
                        resume text DEFAULT null
                    )
                    `, (err, result)=>{
                        if(!err) resolve('ok')
                        if(err) console.log(err)
                    })
                })
                await new Promise((resolve, reject)=>{
                    this.connection.query(`
                    CREATE TABLE resumes(
                        position text,
                        FIO text,
                        born text,
                        city text,
                        contacts text,
                        experience text,
                        education text,
                        languages text,
                        skills text,
                        description text,
                        photo text DEFAULT null,
                        id text
                    )
                    `, (err, result)=>{
                        if(!err) resolve('ok')
                        if(err) console.log(err)
                    })
                })
                await new Promise((resolve, reject)=>{
                    this.connection.query(`
                    CREATE TABLE vacancies(
                        id text,
                        position text,
                        salary text,
                        company text,
                        experience text,
                        company_activity text,
                        activity text,
                        requirements text,
                        conditions text,
                        skills text,
                        city text,
                        address text,
                        date date,
                        coordinates text
                    )
                    `, (err, result)=>{
                        if(!err) resolve('ok')
                        if(err) console.log(err)
                    })
                })
            }
        })
    }
}

module.exports = new Db()