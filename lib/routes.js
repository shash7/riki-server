
/* jslint undef: true */
/* global window, document, $ */

/*
 * routes.js
 * 
 * Serves web page
 */

(function() {
	
	'use strict';
	
	module.exports = {
		routes : [
			{
				route : '/',
				req   : function(req, res) {
					res.writeHead(200, {
						'Content-Type' : 'text/html'
					});
      		res.write('<h1>zz</h1>');
      		res.end();
				}
			},
			{
				route : '/css',
				req   : function(req, res) {
				}
			}
		]
	}
	
})();