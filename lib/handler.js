/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * handler.js
 * 
 * Route handler
 * ---------------------------------------------------------------- */


/* ----------------------------------------------------------------
 * $imports
 * ---------------------------------------------------------------- */
var moment = require('moment');
var auth = require('./auth.js');


/* ----------------------------------------------------------------
 * $utils
 * ---------------------------------------------------------------- */


module.exports = {
	GET : {
		index : function(req, res) {
			// If logged in then reroute to /profile/:name
			auth.isLoggedIn(req, function(result) {
				if(result.success) {
					console.log(result);
					var name = result.personData.name;
					result.personData.logged = true;
					res.render('index', result.personData);
				} else {
					res.render('index');
				}
			});
		},
		profile : function(req, res) {
			res.redirect('/');
		},
		profileName : function(req, res) {
			var name = req.param('name');
			auth.getAccount(name, function(result) {
				if(result.success) {
					
					auth.isLoggedIn(req, function(data) {
						if(data.success) {
							console.log(data);
							result.personData.created = moment(result.personData.created).format('dddd, MMMM Do YYYY');
							data.personData.currentPersonData = result.personData;
							data.personData.logged = true;
							res.render('profile', data.personData);
						} else {
							result.personData.created = moment(result.personData.created).format('dddd, MMMM Do YYYY');
							result.personData.currentPersonData = result.personData;
							res.render('profile', result.personData);
						}
					});
				} else {
					res.status(404).send('Not found');
				}
			});
		},
		notifications : function(req, res) {
			res.send('notifications');
		},
		logout : function(req, res) {
			req.session.name = null;
			res.redirect('/');
		}
	},
	POST : {
		login : function(req, res) {
			auth.login(req, function(result) {
				if(result.success) {
					req.session.name = result.personData.name;
					res.redirect('/');
				} else {
					res.status(401).json(result);
				}
			});
		},
		signup : function(req, res) {
			auth.signup(req, function(result) {
				if(result.success) {
					// Just in case the db is still getting hot or the world ends or something
					setTimeout(function() {
						req.session.name = result.personData.name;
						res.redirect('/');
					}, 500);
				} else {
					res.status(400).json(result);
				}
			});
		},
		post : function(req, res) {
		}
	}
};