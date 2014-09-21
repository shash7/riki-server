/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * db.js
 * 
 * Handles all database connections. Does no AUTH on its own
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	
	/* ----------------------------------------------------------------
	Setup
	---------------------------------------------------------------- */
	var path        = './downloads';
	var crypto      = require('crypto');
	var mongoose    = require('mongoose');
	var model       = require('./model.js');
	var options     = require('../config.js');
	var moment      = require('moment');

	var schemaPerson  = mongoose.Schema(model.person,  { collection : 'person' });
	var schemaPost    = mongoose.Schema(model.post,  { collection : 'post' });

	mongoose.connect('localhost', 'hax');

	var person  = mongoose.model('person', schemaPerson, person);
	var post  = mongoose.model('post', schemaPost, post);


	/* ----------------------------------------------------------------
	Private methods
	---------------------------------------------------------------- */
	// Do we need this?
	function getPassword(name, callback) {
		person.findOne({name:name},'password', function(err, result) {
			if (!result) {
				callback(false);
			} else {
				callback(result.password);
			}
		});
	}
	
	function trimAccount(personData) {
		var obj = {
			name    : personData.name,
			email   : personData.email,
			created : personData.created,
			avatar  : personData.avatar
		};
		return obj;
	}
	
	// TODO
	function getAccounts(arr, callback) {
	}
	
	
	/* ----------------------------------------------------------------
	Public methods
	---------------------------------------------------------------- */
	function createAccount(data, callback) {
		
		// Create the person object ..
		var obj = new person({
			name      : data.name,
			password  : crypto.createHash('sha256').update(data.password).digest('hex'),
			email     : data.email,
			created   : new moment(),
			avatar    : {
				avatarEncode : crypto.createHash('md5').update(data.email).digest('hex'),
				avatarType   : 'gravatar'
			}
		});

		// .. and save it
		obj.save(function(err, data) {
			if(data) {
				// For obvious reasons
				data = trimAccount(data);
				callback({
					success : true,
					personData : data
				});
			} else {
				callback({
					success : false,
					message : 'Something went terribly wrong'
				});
			}
		});
	}
	
	function checkPassword(data, callback) {
		var result = {
			success : false
		};
		var name     = data.name;
		var password = crypto.createHash('sha256').update(data.password).digest('hex');
		var query = person.find({name : name }).limit(1);
		query.exec(function(err, account) {
			console.log(account);
			account = account[0] || null;
			if(account) {
				if(account.password === password) {
					result.success = true;
					result.personData = trimAccount(account);
					callback(result);
				} else {
					result.message = 'Passwords don\'t match';
					callback(result);
				}
 			} else {
				result.message = 'Account not found';
				callback(result);
			}
		});
	}
	
	function checkIfAccountExists(data, callback) {
		var result = {
			success : false
		};
		var query = person.find({name : data.name}).limit(1);
		query.exec(function(err, account) {
			account = account[0] || null;
			if(account) {
				trimAccount(account);
				result.success    = true;
				result.personData = account;
				callback(result);
			} else {
				result.message = 'Couldn\'t find account';
				callback(result);
			}
		});
	}
	
	function createPost(data, callback) {
		var result = {
			success : false
		};
		var obj = new post({
			title    : data.title,
			creator  : data.creator,
			created  : new moment(),
			type     : data.type,
			messsage : data.message,
			post     : data.post || ''
		});
		
		obj.save(function(err, data) {
			if(data) {
				// For obvious reasons
				data = trimAccount(data);
				callback({
					success : true,
					personData : data
				});
			} else {
				callback({
					success : false,
					message : 'Something went terribly wrong'
				});
			}
		});
	}
	
	
	/* ----------------------------------------------------------------
	Exports
	---------------------------------------------------------------- */
	module.exports = {
		createAccount        : createAccount,
		checkPassword        : checkPassword,
		checkIfAccountExists : checkIfAccountExists
	};

})();