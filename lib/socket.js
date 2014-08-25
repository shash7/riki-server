
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * socket.js
 * 
 * Handles socket connection
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	var net    = require('net');
	var moment = require('moment');

	var HOST  = '127.0.0.1';
	var PORT  = 6969;
	var debug = false;
	
	function log(text) {
		if(debug) {
			console.log(text);
		}
	}
	
	exports.start = function(opts) {
		
		opts = opts || {};
		var host  = opts.host   || HOST;
		var port  = opts.port   || PORT;
		var debug = opts.debug  || false;
		
		net.createServer(function(sock) {

			// We have a connection - a socket object is assigned to the connection automatically
			log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

			// Add a 'data' event handler to this instance of socket
			sock.on('data', function(data) {

				console.log('DATA ' + sock.remoteAddress + ': ' + data);
				// Write the data back to the socket, the client will receive it as data from the server
				var obj = {
					time    : moment().format('MMMM Do, h:mm:ss a'),
					message : '' + data
				};
				sock.write(JSON.stringify(obj));

			});

			// Add a 'close' event handler to this instance of socket
			sock.on('close', function(data) {
				log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
			});

			sock.on('end', function(data) {
				log('Disconnected : ' + data);
			});
			
			sock.on('error', function(data) {
				log('Disconnected ERROR : ' + data);
			});

		}).listen(port, host);

		console.log('Server listening on ' + HOST +':'+ PORT);
		
	};
	
})();