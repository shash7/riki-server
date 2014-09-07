
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * server.js
 * 
 * Delegates routes to routes.js
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	
	/* ----------------------------------------------------------------
	 * Imports
	 * ---------------------------------------------------------------- */
	var http       = require('http');
	var fs         = require('fs');
	var mime       = require('mime');
	var path       = require('path');
	var crypto     = require('crypto');
	var config     = require('../config.js');
	var handlebars = require('handlebars');
	
	
	/* ----------------------------------------------------------------
	 * Utility functions
	 * ---------------------------------------------------------------- */
	function containsFile(url, truncate) {
		var arr = url.split('/');
		var text = arr[arr.length-1];
		
		if(text.indexOf('.') > -1) {
			if(truncate) {
				arr.pop();
				return arr.join('/');
			} else {
					return text;
			}
		} else {
			return false;
		}
	}
	
	function containsParam(url, truncate) {
		var arr = url.split('/');
		var text = arr[arr.length-1];
		
		if(text.indexOf(':') > -1) {
			if(truncate) {
				arr.pop();
				return arr.join('/') || '/';
			} else {
				return text.slice(1);
			}
		} else {
			return false;
		}
	}
	
	function checkRoute(req, res, arr) {
			
		var routeFound = false;
		
		// Optimize the looping mechanism
		arr.map(function(data) {
			if(data.route === req.url && !data.param) {
				data.callback(req, res);
				routeFound = true;
			}
			if(data.param && data.route === path.dirname(req.url) && !routeFound) {
				req[data.param] = path.basename(req.url);
				data.callback(req, res);
				routeFound = true;
			}
		});

		return routeFound;
	}
	
	
	/* ----------------------------------------------------------------
	 * Public functions
	 * ---------------------------------------------------------------- */
	module.exports = function() {
		
		var getArray  = [];
		var postArray = [];
		var allArray  = [];
		
		/* The next three public functions add the callbacks, params
		 * and routes inside the above arrays
		 */
		function get(route, callback) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param = param;
				obj.route = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.callback = callback;
			getArray.push(obj);
		}
		
		function post(route, callback) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param = param;
				obj.route = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.callback = callback;
			postArray.push(obj);
		}
		
		function all(route, callback) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param = param;
				obj.route = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.callback = callback;
			allArray.push(obj);
		}
		
		// Main call to start the http server
		function start(port) {
			
			port = port || 80;
			http.createServer(function(req, res) {
				
				var routeFound = false;
				
				if(req.method === 'GET') {
					routeFound = checkRoute(req, res, getArray);
				} else if(req.method === 'POST') {
					routeFound = checkRoute(req, res, postArray);
				} else {
					routeFound = checkRoute(req, res, allArray);
				}
				
				
				/* Add 404 here */
				if(!routeFound) {
					res.end();
				}
				
			}).listen(port);
		}
		
		
	/* ----------------------------------------------------------------
	 * Exports
	 * ---------------------------------------------------------------- */
		return {
			get   : get,
			post  : post,
			all   : all,
			start : start
		};
	};
	
})();