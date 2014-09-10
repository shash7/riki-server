
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * app.js
 * 
 * Main js file for riki
 * ---------------------------------------------------------------- */


(function() {
	
	'use strict';
	
	var x;
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			console.log("Geolocation is not supported by this browser.");
		}
	}
	function isInCircle(objPoint, objCircle, r) {
		var px = objPoint.x;
		var py = objPoint.y;
		var cx = objCircle.x;
		var cy = objCircle.y;
		
		var result = Math.sqrt(Math.pow(cx - px, 2) + Math.pow(cy - py, 2));
		return result <= r;
	}
		
	function showPosition(position) {
		x.innerHTML = "Latitude: " + position.coords.latitude + 
		"<br>Longitude: " + position.coords.longitude +
			"<br>Accuracy: " + position.coords.accuracy;
		var objCircle = {
			x : position.coords.latitude,
			y : position.coords.longitude
		};
		
		var objPoint = {
			x : 149,
			y : -38
		};
		console.log(isInCircle(objPoint, objCircle, 300));
	}
	
	function init() {
		x = document.getElementsByClassName('sidebar')[0];
		getLocation();
	}
	
	init();
	
})();