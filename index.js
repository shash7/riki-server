
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
	
	var opts = {
		debug : true
	};
	
	socket.start(opts);

})();