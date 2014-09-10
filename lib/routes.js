
/* jslint undef: true */
/* global window, document, $ */

/*
 * routes.js
 * 
 * Serves web page
 */

(function() {
	
	'use strict';
	
	var fs = require('fs');
	var path = require('path');
	var mime = require('mime');
	var handlebars = require('handlebars');
	var server = require('./server.js')();
	var utils = server.utils;
	var url  = require('url');
	
	
	/* ----------------------------------------------------------------
	 * Templates
	 * ---------------------------------------------------------------- */
	var templateDir = __dirname + '/../views/';
	var templates = {};
	
	function compile() {
		fs.readdir(templateDir, function(err, files) {
			
			files.forEach(function(fileName) {
				fs.readFile(templateDir + fileName, 'utf8', function(err, file) {
					templates[fileName] = handlebars.compile(file);
				});
				console.log('compiling');
			});
		});
	}
	
	
	/* ----------------------------------------------------------------
	 * Utility functions
	 * ---------------------------------------------------------------- */
	function containsFile(url) {
		var arr = url.split('/');
		var text = arr[arr.length-1];
		
		if(text.indexOf('.') > -1) {
			return text;
		} else {
			return false;
		}
	}
	
	// Optimize
	compile();
	
	
	/* ----------------------------------------------------------------
	 * Routes
	 * ---------------------------------------------------------------- */
	exports.start = function() {
		
		server.get('/', function(req, res) {
			console.log(req.headers);
			var template = templates['about.html']({ name : 'shash7' });
			utils.serveFile(__dirname + '/../public/index.html', res);
		});
		
		server.get('/:name', function(req, res) {
			res.writeHead(200, {
				'Content-type' : 'text/html'
			});
			res.write(templates['about.html']({name : req.name }));
			res.end();
		});
		
		server.get('/css/:fileName', function(req, res) {
			var fileName = containsFile(req.url);
			utils.serveFile(__dirname + '/../public/css/' + fileName, res);
		});
		
		server.get('/js/:fileName', function(req, res) {
			var fileName = containsFile(req.url);
			utils.serveFile(__dirname + '/../public/js/' + fileName, res);
		});
		
		server.get('/img/:fileName', function(req, res) {
			var fileName = req.fileName;
			serveFile(__dirname + '/../public/img/' + fileName, res);
		});

		server.post('/', function(req, res) {
			var data = 'zz';
			
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			res.write(data);
			res.end();
		});
		
		server.start();
	};
	
})();