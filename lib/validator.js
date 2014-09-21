/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * validator.js
 * 
 * Validates all form data and other user inputs
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	module.exports = {
		login : function(data) {
			var result = {
				success : false
			};
			
			if(data.name && data.password) {
				result.success = true;
			} else {
				result.message = 'Please fill in all fields';
			}
			
			return result;
		},
		signup : function(data) {
			
			var result = {
				success : false
			};
			
			if(data.email && data.name && data.password && data.password2) {
				if(data.password === data.password2) {
					result.success = true;
				} else {
					result.message = 'Passwords don\'t match, please try again';
				}
			} else {
				result.message = 'Please fill in all fields';
			}
			
			return result;
		}
	};
	
})();