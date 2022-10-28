/* eslint-disable max-len */
const mysql = require('mysql');
require('dotenv').config();


// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});

/* eslint-disable max-len */
function toGeoJson(data) {
  const outGeoJson = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i =0; i < data.length; i++) {
    const coordA = parseFloat(data[i]['coordA']);
    const coordB = parseFloat(data[i]['coordB']);
    const tempObj = {};
    tempObj['properties'] = data[i];
    tempObj['type']= 'Feature';
    tempObj['geometry']= {'type': 'Point', 'coordinates': [coordA, coordB]};
    outGeoJson['features'].push(tempObj);
  }
  return outGeoJson;
}

module.exports = {toGeoJson};
