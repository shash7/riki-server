
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * app.js
 * 
 * Main js file for riki
 * ---------------------------------------------------------------- */


(function() {
	
	'use strict';
	
	
/* ----------------------------------------------------------------
 * $globals
 * ---------------------------------------------------------------- */
	var g = {
	};
	var bootloader = [];
	
	
/* ----------------------------------------------------------------
 * $templates
 * ---------------------------------------------------------------- */
	var template = {
		
		compile : function() {
			$('.template').each(function(i) {
				var el = $(this);
				var id = el.attr('id');
				var key = id.split('-')[0];
				template[key] = Handlebars.compile($('#' + id).html());
			});
		}
	};
	bootloader.push(template.compile);
	
/* ----------------------------------------------------------------
 * $modals
 * ---------------------------------------------------------------- */
	var modal = {
		m : null,
		active : false,
		showLogin : function() {
			modal.m.create(template.login(), { isSmall : true }, function() {
				$('.modal-container input[name="name"]').focus();
			});
			modal.active = true;
		},
		showSignup : function() {
			modal.m.create(template.signup(), { isSmall : true }, function() {
				$('.modal-container input[name="name"]').focus();
			});
			modal.active = true;
		},
		close : function() {
			modal.m.unstage();
			modal.active = false;
		}
	};
	modal.m = new Modal({
		closeOnClick : false
	});
	
	
/* ----------------------------------------------------------------
 * $events
 * ---------------------------------------------------------------- */
	function setup() {
		$('a[data-action="login"]').click(modal.showLogin);
		$('a[data-action="signup"]').click(modal.showSignup);
		$(document).on('click', '[data-action="close-modal"]', modal.close);
		$(document).keyup(function(e) {
			console.log(e.keyCode);
			if(e.keyCode === 27) {
				if(modal.active) {
					modal.close();
				}
			}
		});
	}
	bootloader.push(setup);
	
	
/* ----------------------------------------------------------------
 * $bootstart
 * ---------------------------------------------------------------- */
	function init() {
		bootloader.map(function(fx) {
			fx(); // Call this only ONCE
		});
	}
	
	init();
	
})();