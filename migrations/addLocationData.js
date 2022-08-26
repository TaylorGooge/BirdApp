/* eslint-disable max-len */
const mysql = require('mysql');
const axios = require('axios');
// ///env //////
require('dotenv').config();

// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});


function trimArray(array) {
  array.forEach((element, index) => {
    array[index] = element.trim();
  });
  return;
}

function query(array, results) {
  db.query(`UPDATE defaultdb.birdSighting SET locality= coalesce(locality,'${array[0]}'), country=coalesce(country,'${array[2]}') , state= coalesce(state,'${array[1]}') WHERE id = ${results}`, function(err, results1) {
    if (err) {
      console.log(err);
    } else {
    }
  });
}

db.query('SELECT * FROM defaultdb.birdSighting', function(error, results) {
  if (error) {
    throw error;
  } else {
    for (let i = 0; i < results.length; i++) {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${results[i].coordB},${results[i].coordA}&result_type=locality&key=${process.env.reverseGeocoding}`)
          .then(function(response) {
            try {
              const locationInfo = response.data['results'][0]['formatted_address'];
              locationInfo = locationInfo.split(',');
              trimArray(locationInfo);
              query(locationInfo, results[i].id);
            } catch {
              try {
                let locationInfo = response.data['plus_code']['compound_code'];
                locationInfo = locationInfo.slice(9);
                locationInfo = locationInfo.split(',');
                trimArray(locationInfo);
                query(locationInfo, results[i].id);
              } catch {
              }
            }
          });
    }
  }
  return 0;
});

