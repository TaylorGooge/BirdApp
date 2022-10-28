/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const moment = require('moment');
const helpers = require('../Scripts/helpers');
const axios = require('axios');

// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});

router.get('/getbirds', function(req, res, next) {
  db.query('SELECT * FROM birdcodes', function(error, results) {
    if (error) {
      throw (error);
    } else {
      res.send(JSON.stringify(results));
    }
  });
});

router.post('/getUserID', function(req, res, next) {
  db.query('SELECT * FROM birdUsers WHERE email= ?', [req.query.email], function(error, results) {
    if (results.length === 0 ) {
      if (!(req.query.email && req.query.userName)) {
        return res.status(401).json({error: 'Couldn\'t complete request- request missing data'});
      } else {
        db.query('INSERT INTO birdUsers (email, userName) VALUES (?, ?)', [req.query.email, req.query.userName], function( err, results2) {
          if (err) {
            return res.status(401).json({error: 'Couldn\'t complete request- problem with user id'});
          }
        });
      }
    }
    res.send(JSON.stringify(results));
  });
});

router.post('/postBird', function(req, res, next) {
  const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  db.query('SELECT id FROM birdUsers WHERE email= ?', [req.body.email], function(error, results) {
    if (error) {
      return res.status(401).json({error: 'Couldn\'t complete request- problem with user id'});
    } else {
      if (!results[0]) {
        return res.status(401).json({error: 'Couldn\'t complete request- problem with user id'});
      }
      const id =results[0].id;
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.coordB},${req.body.coordA}&result_type=locality&key=${process.env.reverseGeocoding}`)
          .then(function(response) {
            try {
              const locationInfo = response.data['results'][0]['formatted_address'];
              locationInfo = locationInfo.split(',');
              trimArray(locationInfo);
              console.log('calling 1');
              reverseLocQuery(req, date, locationInfo, id).then( (v) => res.send(JSON.stringify(v)));
              return;
            } catch {
              try {
                let locationInfo = response.data['plus_code']['compound_code'];
                locationInfo = locationInfo.slice(9);
                locationInfo = locationInfo.split(',');
                trimArray(locationInfo);
                console.log('calling 2');
                reverseLocQuery(req, date, locationInfo, id).then( (v) => res.send(JSON.stringify(v)));
                return;
              } catch {
                console.log('calling 3');
                fallBackQuery(req, date, id).then( (v) => res.send(JSON.stringify(v)));
                return;
              }
            }
          });
    }
  });
});

router.post('/deleteEntry', function(req, res, next) {
  db.query('DELETE FROM birdSighting WHERE id=?', [req.body.id], function(error, results) {
    if (error) {
      throw (error);
    }
    res.send(JSON.stringify(results));
  });
});

router.get('/searchBird/:id?/:group?', function(req, res, next) {
  if (!(req.query.id || req.query.group)) {
    return res.status(401).json({error: 'Couldn\'t complete request- request is empty'});
  }
  if (req.query.id) {
    db.query( `SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA, 
                birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes 
                INNER JOIN birdSighting on 
                birdcodes.birdID = birdSighting.birdID 
                INNER JOIN birdUsers on birdUsers.id = birdSighting.userID 
                WHERE birdSighting.birdID = ? `, [req.query.id], function(error, results) {
      if (error) {
        throw (error);
      }
      // todo to geojson
      res.send(JSON.stringify(results));
    });
  } else {
    db.query(`SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA,
      birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes
      INNER JOIN birdSighting on 
      birdcodes.birdID = birdSighting.birdID 
      INNER JOIN birdUsers on birdUsers.id = birdSighting.userID 
      WHERE birdcodes.birdGroup = ? `, [req.query.group], function(error, results1) {
      if (error) {
        throw (error);
      } else {
        // todo to geojson
        res.send(JSON.stringify(results1));
      }
    });
  }
  ;
});

router.get('/getgroups', function(req, res, next) {
  db.query('SELECT * FROM bird_categories', function(error, results) {
    if (error) {
      return res.status(401).json({error: 'Couldn\'t complete request'});
    } else {
      res.send(JSON.stringify(results));
    }
  });
});

router.get('/getlogged', function(req, res, next) {
  if (!(req.query.email)) {
    return res.status(401).json({error: 'Couldn\'t complete request- request missing data'});
  }
  db.query('SELECT id FROM birdUsers WHERE email= ?', [req.query.email], function(error, results) {
    if (results.length === 0 ) {
      if (!req.query.userName) {
        return res.status(401).json({error: 'Couldn\'t complete request- request missing data'});
      } else {
        db.query('INSERT INTO birdUsers (email, userName) VALUES (?, ?)', [req.query.email, req.query.userName], function( err, results2) {
          if (err) {
            return res.status(401).json({error: 'Couldn\'t complete request- user information is invalid or empty'});
          } else {
            return res.status(200).json();
          }
        });
      }
    } else {
      const id =results[0].id;
      db.query( `SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA,
              birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes
              INNER JOIN birdSighting on
              birdcodes.birdID = birdSighting.birdID
              INNER JOIN birdUsers on birdUsers.id = birdSighting.userID
              WHERE birdSighting.userID = ?
              ORDER BY  birdSighting.date desc `, [id], function(error, results) {
        if (error) {
          throw (error);
        }
        res.send(JSON.stringify(results));
      });
    }
  });
});

router.get('/getloggedAll', function(req, res, next) {
  db.query( `SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA,
              birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes
              INNER JOIN birdSighting on
              birdcodes.birdID = birdSighting.birdID
              INNER JOIN birdUsers on birdUsers.id = birdSighting.userID
              ORDER BY  birdSighting.date desc `, function(error, results) {
    if (error) {
      throw (error);
    }
    res.send(JSON.stringify(results));
  });
});


module.exports = router;



//////
function trimArray(array) {
  array.forEach((element, index) => {
    array[index] = element.trim();
  });
  return;
}

async function fallBackQuery(req, date, id) {
  db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date) VALUES (?, ?, ?, ?, ?)', [id, req.body.bird,
    req.body.coordA, req.body.coordB, date], function(error, results) {
    if (error) {
      return 401;
    } else {
      return JSON.stringify(results);
    }
  });
}

async function reverseLocQuery(req, date, locationInfo, id) {
  db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date, locality, country, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [id, req.body.bird,
    req.body.coordA, req.body.coordB, date, `${locationInfo[0]}`, `${locationInfo[2]}`, `${locationInfo[1]}`], function(error, results) {
    if (error) {
      return 401;
    } else {
      return JSON.stringify(results);
    }
  });
}
