
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
			
			var url = req.url;
			
			var sha = crypto.createHash('sha1').update('gg').digest('hex');
			console.log(sha);
			
			routes.map(function(data) {
				if(data.route === url) {
					data.req(req, res);
				}
			});
			
		}).listen(80);
		
	}
	
})();