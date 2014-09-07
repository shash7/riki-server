
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
	
	function send404(res) {
		res.writeHead(404, {
			'Content-Type' : 'text/html'
		});
		res.write('<h1>404 Not found</h1>');
		res.end();
	}
	
	function send500(res) {
		res.writeHead(500, {
			'Content-Type' : 'text/html'
		});
		res.write('<h1>404 Not found</h1>');
		res.end();
	}
	
	function serveFile(filePath, res) {
		
		fs.exists(filePath, function(exists) {
			if(exists) {
				// Add optional ut8 parameter in function
				fs.readFile(filePath, /* 'utf8',*/ function(err, file) {
					if(file) {
						res.writeHead(200, {
							'Content-Type' : mime.lookup(filePath)
						});
						res.write(file, 'binary');
						res.end();
					} else {
						send500(res);
					}
				});
			} else {
				send404(res);
			}
		});
	}
	
	
	/* ----------------------------------------------------------------
	 * Routes
	 * ---------------------------------------------------------------- */
	exports.start = function() {
		
		// Optimize
		compile();
		console.log('compiled');
		
		server.get('/', function(req, res) {
			console.log(templates);
			var template = templates['about.html']({ name : 'shash7' });
			console.log(template);
			serveFile(__dirname + '/../public/index.html', res);
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
			serveFile(__dirname + '/../public/css/' + fileName, res);
		});
		
		server.get('/img/:fileName', function(req, res) {
			var fileName = req.fileName;
			serveFile(__dirname + '/../public/img/' + fileName, res);
		});

		server.post('/', function(req, res) {
			
			var data = JSON.stringify({
				name : 'shash7'
			});
			
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			res.write(data);
			res.end();
		});
		
		server.start();
	};
	
})();