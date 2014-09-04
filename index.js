
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * index.js
 * 
 * Sets up riki-server
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	var socket = require('./lib/socket.js');
	var config = require('./config.js');
	
	socket.start();
	
	if(config.http) {
		var server = require('./lib/server.js');
		
		server.start();
	}

})();