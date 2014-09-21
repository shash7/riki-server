/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * routes.js
 * 
 * All routes are defined here
 * ---------------------------------------------------------------- */


(function() {
	
	'use strict';
	
	var express = require('express');
	var handler = require('./handler.js');
	var appConfig = require('./app-config.js');
	
	var app = express();
	appConfig.setup(app, express);
	
	
/* ----------------------------------------------------------------
 * $routes
 * ---------------------------------------------------------------- */
	app.get('/', handler.GET.index);
	
	app.get('/profile/:name', handler.GET.profileName);
	
	app.get('/logout', handler.GET.logout);
	
	app.get('/profile/:name/notifications', handler.GET.notifications);
	
	app.post('/login', handler.POST.login);
	
	app.post('/signup', handler.POST.signup);
	
	app.post('/profile/:name/post', handler.POST.post);
	
	// Serve static files
	app.use('/profile', express.static('./public'));
	app.use(express.static('./public'));
	
	module.exports = function() {
		app.listen(80);
	};
	
})();