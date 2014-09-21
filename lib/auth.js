/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * auth.js
 * 
 * Authentication layer. All db calls are routed from here
 * ---------------------------------------------------------------- */

var db = require('./db.js');
var validate = require('./validator.js');


(function() {
	
	'use strict';
	
	module.exports = {
		isLoggedIn : function(req, callback) {
			var obj = {
				name : req.session.name
			};
			db.checkIfAccountExists(obj, function(result) {
				callback(result);
			});
		},
		login : function(req, callback) {
			/*
			 * Accepts : req | obj with form data, callback
			 * Gives : obj with success and/or message/personData
			 */
			var personData = req.body;
			var result = validate.login(personData);
			if(result) {
				result.success = false; // Because most of the test cases are meant to fail
				db.checkPassword(personData, function(data) {
					if(data.success) {
						result.success = true;
						result.personData = data.personData;
						callback(result);
					} else {
						result.message = data.message;
						callback(result);
					}
				});
			} else {
				callback(result);
			}
		},
		signup : function(req, callback) {
			/*
			 * Accepts : req | obj with form data, callback
			 * Gives : obj with success and/or message/personData
			 */
			var personData = req.body;
			var result = validate.signup(personData);
			if(result.success) {
				result.success = false; // See above function
				// Check if account already exists
				db.checkIfAccountExists(personData, function(data) {
					// If not then create a new account
					if(!data.success) {
						db.createAccount(personData, function(data) {
							if(data.success) {
								result.success = true;
								result.personData = data.personData;
								callback(result);
							} else {
								result.message = 'Something went wrong on our side, sorry about that';
								callback(result);
							}
						});
					} else {
						result.message = 'Name is taken, please try another one';
						callback(result);
					}
				});
			} else {
				callback(result);
			}
		},
		getAccount : function(name, callback) {
			/*
			 * Accepts : Account name
			 * Gives obj with success and/or message/personData
			 */
			var obj = {
				name : name
			};
			db.checkIfAccountExists(obj, function(data) {
				callback(data);
			});
		}
	};
	
})();