const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// connection 객체 생성
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// connection 실행
connection.connect(error=>{
    if (error)
        throw error;
    
    console.log("Successfully connected to the database.");
});

module.exports = connection;