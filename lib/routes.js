
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
	
	function sendFile(data, res) {
		res.writeHead(200, {
			'Content-Type' : data.mimeType
		});
		res.write(data.file, 'binary');
		res.end();
	}
	
	module.exports = {
		routes : [
			{
				route : '/',
				req   : function(req, res) {
					
					var filePath = __dirname + '/../public/index.html';
					
					fs.exists(filePath, function(exists) {
						if(exists) {
							fs.readFile(filePath, 'utf8', function(err, file) {
								if(file) {
									var data = {};
									data.mimeType = mime.lookup(filePath);
									data.file = file;
									sendFile(data, res);
								} else {
									send500(res);
								}
							});
						} else {
							send404(res);
						}
					});
				}
			},
			{
				route : '/css',
				req   : function(req, res) {
					
					var fileName = path.basename(req.url);
					var filePath = __dirname + '/../public/css/' + fileName;
					
					fs.exists(filePath, function(exists) {
						if(exists) {
							fs.readFile(filePath, 'utf8', function(err, file) {
								if(file) {
									var data = {};
									data.mimeType = mime.lookup(filePath);
									data.file = file;
									sendFile(data, res);
								} else {
									send500(res);
								}
							});
						} else {
							send404(res);
						}
					});
					
				}
			},
			{
				route : '/js',
				req   : function(req, res) {
					
					var fileName = path.basename(req.url);
					var filePath = __dirname + '/../public/js/' + fileName;
					
					fs.exists(filePath, function(exists) {
						if(exists) {
							fs.readFile(filePath, 'utf8', function(err, file) {
								if(file) {
									var data = {};
									data.mimeType = mime.lookup(filePath);
									data.file = file;
									sendFile(data, res);
								} else {
									send500(res);
								}
							});
						} else {
							send404(res);
						}
					});
					
				}
			}
		]
	}
	
})();