let express = require('express')
let app = express()
let mysql = require('mysql')
let port = process.env.PORT || 3656
let path = require('path')
let bodyParser = require('body-parser')
///////////
require('dotenv').config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.set('port', port)


/////api//////
var db  = mysql.createPool({
    user: process.env.user,
    password:  process.env.password,
    host:  process.env.host,
    port:  process.env.port,
    database:  process.env.database,
})


var fs = require('fs');
var csv = require('fast-csv')

function insert(records){
    db.query('INSERT INTO birdcodes (englishName , fourCode, scientificName, sixCode) VALUES(?, ?, ?, ?)',[records.englishName, records.fourCode,
        records.sciName, records.sixCode], function (error, results) {
            if (error){
                throw(error)
            }
        });

}


fs.createReadStream(__dirname+'/data.csv')
    .pipe(csv.parse({headers: true}))
    .on('error', error => console.error(error))
    .on('data', row => insert(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));