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

// ///api //////
const api = require('./Api/api');

// ///paths//////
app.use(express.static(path.join(__dirname + '/Styles')));
app.use(express.static(path.join(__dirname + '/Scripts')));
app.use(express.static(path.join(__dirname + '/Images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', api);

app.set('trust proxy', true);

module.exports = app;

