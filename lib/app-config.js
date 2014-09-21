/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * app-config.js
 * 
 * Contains config options relevant only to express
 * ---------------------------------------------------------------- */


(function() {
	
	'use strict';
	

/* ----------------------------------------------------------------
Dependencies
---------------------------------------------------------------- */
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var session        = require('cookie-session');
var exphbs         = require('express-handlebars');
var morgan         = require('morgan');
var multer         = require('multer');
var config         = require('../config.js');


/* ----------------------------------------------------------------
Express configuration
---------------------------------------------------------------- */
exports.setup = function(app, express) {
	app.disable('x-powered-by');
	app.disable('view cache'); // Remove for production
	app.set('env', 'development'); // Remove for production
	app.set('views', './views');
	app.set('view engine', 'html');
	app.engine('html', exphbs.create().engine);
	app.use(cookieParser());
	app.use(session({
		key    : config.cookieName,
		secret : config.cookeSecret,
		cookie : {
			maxAge : 1920000
		}
	}));
	app.use(bodyParser());
	app.use(multer({
		dest: './uploads/',
		rename : function(fieldName, fileName) {
			return fileName;
		}
	}));
	
	app.use(morgan('dev')); // Remove for production
};
	
})();
