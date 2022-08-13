/* eslint-disable max-len */
const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 3656;
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');
const axios = require('axios');

// ///handlebars setup//////
let handlebars = require('handlebars');
const {engine} = require('express-handlebars');
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');
const extend = require('handlebars-extend-block');
const globals= require('./handlebarsGlobals');
handlebars = extend(handlebars);

// ///env //////
require('dotenv').config();

// ///paths//////
app.use(express.static(path.join(__dirname + '/Styles')));
app.use(express.static(path.join(__dirname + '/Scripts')));
app.use(express.static(path.join(__dirname + '/Images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ///auth0 setup//////
const {auth, requiresAuth} = require('express-openid-connect');
app.set('trust proxy', true);

function getUser(req) {
  return {
    user: req.oidc.isAuthenticated() ? req.oidc.user.nickname : false,
    email: req.oidc.isAuthenticated() ? req.oidc.user.email : false,
  };
}

app.use(
    auth({
      authRequired: false,
      auth0Logout: true,
      secret: process.env.secret,
      baseURL: process.env. baseURL,
      clientID: process.env.clientID,
      issuerBaseURL: process.env.issuerBaseURL,
    }),
);

// ///routes//////
app.get('/', function(req, res, next) {
  res.render('index', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req), active: 'Home'});
});

app.get('/map', requiresAuth(), function(req, res, next) {
  res.render('map', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req), active: 'Map'});
});

app.get('/profile', requiresAuth(), function(req, res, next) {
  userNav = req.oidc.isAuthenticated() ? req.oidc.user.nickname : false;

  const userMap = {
    email: req.oidc.user.email,
    firstName: req.oidc.user.given_name,
    lastName: req.oidc.user.family_name,
    userName: req.oidc.user.nickname,
    profilePic: req.oidc.user.picture,
  };
  res.render('profile', {headerFooter: globals.globalVars['headerFooter'], userMap: userMap, user: getUser(req)});
});


app.get('/about', function(req, res, next) {
  res.render('about', {headerFooter: globals.globalVars['headerFooter'], user: getUser(req)});
});

app.get('/logout', requiresAuth(), function(req, res, next) {
  axios.get('https://' + baseURL + '/v2/logout?' +
        'client_id=' + clientID + '&returnTo=' + baseUrl);

  res.render('index', {headerFooter: globals.globalVars['headerFooter'], user: getUser(req)});
});

app.get('/help', function(req, res, next) {
  res.render('help', {headerFooter: globals.globalVars['headerFooter'], user: getUser(req), accordion: globals.globalVars['accordion']});
},
);
// ///api//////
const db = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.port,
  database: process.env.database,
});

app.get('/getbirds', function(req, res, next) {
  db.query('SELECT * FROM birdcodes', function(error, results) {
    if (error) {
      throw (error);
    } else {
      res.send(JSON.stringify(results));
    }
  });
});

app.post('/getUserID', function(req, res, next) {
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

app.post('/postBird', function(req, res, next) {
  const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  db.query('SELECT id FROM birdUsers WHERE email= ?', [req.body.email], function(error, results) {
    if (error) {
      throw (error);
    } else {
      const id =results[0].id;
      db.query('INSERT INTO birdSighting (userID, birdID, coordA, coordB, date) VALUES (?, ?, ?, ?, ?)', [id, req.body.bird,
        req.body.coordA, req.body.coordB, date], function(error, results) {
        if (error) {
          throw (error);
        }
        res.send(JSON.stringify(results));
      });
    }
  });
});

app.post('/deleteEntry', function(req, res, next) {
  db.query('DELETE FROM birdSighting WHERE id=?', [req.body.id], function(error, results) {
    if (error) {
      throw (error);
    }
    res.sendStatus(200);
  });
});

app.post('/getlogged', function(req, res, next) {
  db.query('SELECT id FROM birdUsers WHERE email= ?', [req.body.email], function(error, results) {
    if (error) {
      throw (error);
    } else {
      const id =results[0].id;
      db.query( 'SELECT birdcodes.englishName, defaultdb.birdSighting.date, birdSighting.birdId, birdSighting.coordA,' +
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

// app.get('/getsearch', function(req, res, next) {
//   db.query( 'SELECT birdcodes.englishName, defaultdb.birdSighting.date, birdSighting.birdId, birdSighting.coordA,' +
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


app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// Creating object of key and certificate
// for SSL
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

// Creating https server by passing
// options and app object
https.createServer(options, app)
    .listen(port, function(req, res) {
      console.log(`Server started at port ${port}`);
    },
    );
