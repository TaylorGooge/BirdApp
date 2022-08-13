const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 3656;
const path = require('path');
const bodyParser = require('body-parser');
// /////////
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', port);


// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});


const fs = require('fs');
const csv = require('fast-csv');

function insert(records) {
  db.query('INSERT INTO birdcodes (englishName , fourCode, scientificName, sixCode) VALUES(?, ?, ?, ?)', [records.englishName, records.fourCode,
    records.sciName, records.sixCode], function(error, results) {
    if (error) {
      throw (error);
    }
  });
}


fs.createReadStream(__dirname+'/data2.csv')
    .pipe(csv.parse({headers: true}))
    .on('error', (error) => console.error(error))
    // .on('data', data => console.log(data))
    .on('data', (row) => insert(row))
    .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`)); 1;
