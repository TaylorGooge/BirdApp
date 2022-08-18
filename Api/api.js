const express = require('express');
const router = express.Router();
const mysql = require('mysql');
require('dotenv').config();
const moment = require('moment');

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
      db.query('INSERT INTO birdUsers (email) VALUES (?)', [req.body.email], function( err, results2) {
        if (err) {
          throw (err);
        }
      });
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

router.post('/getlogged', function(req, res, next) {
  db.query('SELECT id FROM birdUsers WHERE email= ?', [req.body.email], function(error, results) {
    if (error) {
      throw (error);
    } else {
      const id =results[0].id;
      db.query( 'SELECT birdcodes.englishName, birdSighting.date, birdSighting.birdId, birdSighting.coordA,' +
              'birdSighting.coordB, birdSighting.id, birdSighting.userID FROM birdcodes '+
              'INNER JOIN birdSighting on ' +
              'birdcodes.birdID = birdSighting.birdId ' +
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

// router.get('/getsearch', function(req, res, next) {
//   db.query( 'SELECT birdcodes.englishName, birdSighting.date, birdSighting.birdId, birdSighting.coordA,' +
//   'birdSighting.coordB, birdSighting.id FROM birdcodes '+
//   'INNER JOIN birdSighting on ' +
//   'birdcodes.birdID = birdSighting.birdId WHERE birdcodes.birdGroup= ?',
//    [req.body.id], function(error, results) {
//         if (error) {
//           throw (error);
//         }
//         console.log(JSON.stringify(results))
//         res.send(JSON.stringify(results));
// });

module.exports = router;
