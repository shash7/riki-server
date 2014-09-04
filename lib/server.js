
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * server.js
 * 
 * Delegates routes to routes.js
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	var http     = require('http');
	var fs       = require('fs');
	var mime     = require('mime');
	var path     = require('path');
	var crypto   = require('crypto');
	var config   = require('../config.js');
	var fileName = __dirname + '/../public/index.html';
	var routes   = require('./routes.js').routes;
	
	exports.start = function() {
		
		http.createServer(function(req, res) {
			
			var url        = path.dirname(req.url);
			var routeFound = false;
			
			console.log(url);
			
			var sha = crypto.createHash('sha1').update('gg').digest('hex');
			console.log(sha);
			
			routes.map(function(data) {
				if(data.route === url) {
					data.req(req, res);
					routeFound = true;
				}
			});
			
			if(!routeFound) {
				res.writeHead(404, {
					'Content-Type' : 'text/html'
				});
      	res.write('<h1>404 Not found</h1>');
      	res.end();
			}
			
		}).listen(80);
		
	}
	
})();