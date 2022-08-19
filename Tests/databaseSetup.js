
module.exports = async () => {
  const mysql = require('mysql');
  const dotenv = require('dotenv');
  dotenv.config();
  const fs = require('fs');
  const readline = require('readline');

  const db = mysql.createConnection({
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    multipleStatements: true,
  });


  const rl = readline.createInterface({
    input: fs.createReadStream(`${__dirname}/databaseQueries.sql`),
    terminal: false,
  });
  rl.on('line', function(chunk) {
    db.query(chunk.toString('ascii'), function(err, sets, fields) {
      if (err) console.log(err);
    });
  });
  rl.on('close', function() {
    db.end();
  });
};
