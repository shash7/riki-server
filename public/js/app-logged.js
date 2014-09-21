
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
		personName : personName,
		postLink : '',
		postImageExternal : '',
		timeout : 8000
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
 * $handler
 * ---------------------------------------------------------------- */
	var handler = {
		postLink : function() {
			
			console.log(g.postLink);
			
			var obj = {
				url : '/profile/',
				data : {
					type : 'post-link',
					message : g.postLink
				}
			};
			
			handler.req(obj, function(e, code, data) {
				console.log(e);
				console.log(code);
				console.log(data);
			});
		},
		req : function(data, callback) {
			$.ajax({
				url  : data.url    || '',
				type : data.method || 'post',
				data : data.data,
				timeout : data.timeout || g.timeout,
				statusCode : {
					200 : function(data) {
						callback(200, data);
					},
					201 : function(data) {
						callback(201, data);
					},
					400 : function(data) {
						callback(400, data);
					},
					401 : function(data) {
						callback(401, data);
					},
					403 : function(data) {
						callback(403, data);
					}
				}
			});
		}
	};
	
	
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
		showPost : function(obj) {
			g.postLink = obj.link;
			modal.m.create(template.postLink(obj), {}, function() {
				$('.modal-container button').focus();
			});
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
		$(document).on('dnd:link', function(e, data) {
			modal.showPost(data);
		});
		$(document).on('dnd:files', function(e) {
			console.log(e);
		});
		$(document).on('post:link', function(e) {
			handler.postLink();
		});
	}
	bootloader.push(setup);
	
		
/* ----------------------------------------------------------------
 * $droplr
 * ---------------------------------------------------------------- */
	var droplr = new Droplr({
		onDragStart : function(e) {
			e.preventDefault();
			$('body').addClass('dropped');
		},
		onDragOver : function(e) {
			e.preventDefault();
			$('body').addClass('dropped');
		},
		onDragLeave : function(e) {
			e.preventDefault();
			$('body').removeClass('dropped');
		},
		onDrop : function(e) {
			e.preventDefault();
			$('body').removeClass('dropped');
		},
	});
	bootloader.push(droplr.start);
	
	
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