/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const moment = require('moment');
const toGeoJson = require('../Scripts/helpers');

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
  db.query('SELECT * FROM birdUsers WHERE email= ?', [req.body.email], function(error, results) {
    if (results.length === 0 ) {
      if (!(req.body.email && req.body.userName)) {
        return res.status(401).json({error: 'Couldn\'t complete request- request missing data'});
      } else {
        db.query('INSERT INTO birdUsers (email, userName) VALUES (?, ?)', [req.body.email, req.body.userName], function( err, results2) {
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
      res.status(401).json({error: 'Couldn\'t complete request- problem with user id'});
    } else {
      if (!results[0]) {
        return res.status(401).json({error: 'Couldn\'t complete request- problem with user id'});
      }
      const id =results[0].id;
      db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date) VALUES (?, ?, ?, ?, ?)', [id, req.body.bird,
        req.body.coordA, req.body.coordB, date], function(error, results) {
        if (error) {
          res.status(401).json({error: 'Couldn\'t complete request- issue with birdSighting'});
        }
        res.send(JSON.stringify(results));
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
    res.status(401).json({error: 'Couldn\'t complete request- request is empty'});
    res.send(JSON.stringify(results));
  }
  if (req.query.id) {
    db.query( 'SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA, ' +
                'birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes '+
                'INNER JOIN birdSighting on ' +
                'birdcodes.birdID = birdSighting.birdID ' +
                'INNER JOIN birdUsers on birdUsers.id = birdSighting.userID ' +
                'WHERE birdSighting.birdID = ? ', [req.query.id], function(error, results) {
      if (error) {
        throw (error);
      }
      // todo to geojson
      res.send(JSON.stringify(results));
    });
  } else {
    db.query('SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA, ' +
      'birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes '+
      'INNER JOIN birdSighting on ' +
      'birdcodes.birdID = birdSighting.birdID ' +
      'INNER JOIN birdUsers on birdUsers.id = birdSighting.userID ' +
      'WHERE birdcodes.birdGroup = ? ', [req.query.group], function(error, results1) {
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
            res.status(401).json({error: 'Couldn\'t complete request- user information is invalid or empty'});
          }
        });
      }
    } else {
      const id =results[0].id;
      db.query( 'SELECT birdcodes.englishName, birdSighting.date, birdUsers.userName, birdSighting.birdID, birdSighting.coordA, ' +
              'birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes '+
              'INNER JOIN birdSighting on ' +
              'birdcodes.birdID = birdSighting.birdID ' +
              'INNER JOIN birdUsers on birdUsers.id = birdSighting.userID ' +
              'WHERE birdSighting.userID = ? ' +
              'ORDER BY  birdSighting.date desc '+
              'LIMIT 5', [id], function(error, results) {
        if (error) {
          throw (error);
        }
        res.send(JSON.stringify(results));
      });
    }
  });
});

module.exports = router;
