var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const {engine} = require('express-handlebars')

dotenv.config()

// ROUTERS
var indexRouter = require('./app/routes/index');
var authRouter = require('./app/middlewares/auth');
var userController = require('./app/controllers/user.controller');
var bootcampController = require('./app/controllers/bootcamp.controller');

var app = express();

// VIEW ENGINE SETUP
const handlebars = exphbs.create({
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views/partials')
});
app.engine(".hbs", engine({extname: '.hbs'}));
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'app/views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// STATICS
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/axios/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/toastr/build')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// RUTAS
app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api', userController);
app.use('/api', bootcampController);

module.exports = app;
