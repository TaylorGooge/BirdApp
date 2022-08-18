/* eslint-disable max-len */
const express = require('express');
const app = express();
const mysql = require('mysql');
const port = process.env.PORT || 3656;
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const helpers = require('./Scripts/helpers');

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

// ///api //////
const api = require('./Api/api');

// ///paths//////
app.use(express.static(path.join(__dirname + '/Styles')));
app.use(express.static(path.join(__dirname + '/Scripts')));
app.use(express.static(path.join(__dirname + '/Images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);
app.set('port', port);

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
      baseURL: process.env.baseURL,
      clientID: process.env.clientID,
      issuerBaseURL: process.env.issuerBaseURL,
    }),
);

// ///routes//////
app.get('/', function(req, res, next) {
  res.render('index', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req), active: 'Home'});
});

app.get('/map', requiresAuth(), function(req, res, next) {
  user = getUser(req);
  if (user.email) {
    axios.get(`${process.env.baseURL}/getlogged?email=${user.email}`)
        .then(function(response) {
          res.render('map', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req), active: 'Map', data: JSON.stringify(helpers.toGeoJson(response.data))});
        });
  }
});

app.get('/profile', requiresAuth(), function(req, res, next) {
  const userMap = {
    email: req.oidc.user.email,
    firstName: req.oidc.user.given_name,
    lastName: req.oidc.user.family_name,
    userName: req.oidc.user.nickname,
    profilePic: req.oidc.user.picture,
  };
  res.render('profile', {headerFooter: globals.globalVars['headerFooter'], userMap: userMap, userNav: getUser(req)});
});

app.get('/about', function(req, res, next) {
  res.render('about', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req)});
});

app.get('/logout', requiresAuth(), function(req, res, next) {
  axios.get('https://' + baseURL + '/v2/logout?' +
        'client_id=' + clientID + '&returnTo=' + baseURL);
  res.render('index', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req)});
});

app.get('/help', function(req, res, next) {
  res.render('help', {headerFooter: globals.globalVars['headerFooter'], userNav: getUser(req), accordion: globals.globalVars['accordion']});
},
);


// ///create server //////
app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
