/* jslint undef: true, vars: true */
/* global window, document */


/* ----------------------------------------------------------------
 * droplr.js
 * Main application file for flute
 * 
 * Menu :
 *  globals
 *  utils
 *  net
 *  dnd
 *  main
 * ---------------------------------------------------------------- */


(function(window, document, undefined) {
	
	'use strict';
	
	
	/*
	 * $utils | Utility functions
	 */
	var utils = {
		isFunction : function(obj) {
			return typeof obj === 'function';
		},
		isArray : Array.isArray || function(obj) {
			return toString.call(obj) == '[object Array]';
		},
		isLink : function(str) {
			var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
				"?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
				"(([0-9]{1,3}\.){3}[0-9]{1,3}" +
				"|" +
				"([0-9a-z_!~*'()-]+\.)*" +
				"([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." +
				"[a-z]{2,6})" +
				"(:[0-9]{1,4})?" +
				"((/?)|" +
				"(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
			var re = new RegExp(strRegex);
			return re.test(str);
		},
		getExtension : function(str) {
			var re = /(?:\.([^.]+))?$/;
			//str = str.split('.');
			//var len = str.length;
			console.log(utils.isLink(str));
			return re.exec(str)[1];
		},
		noop : function(e) {
			e.preventDefault();
		},
		noopGeneric : function() {
		}
	};
	
	
	/*
	 * $net | XHR and other network stuff
	 */
	var net = {
		
		sendFile : function(files, url) {
			var formData;
			formData = new FormData();
			for (var i = 0; i < files.length; i++) {
				formData.append('file', files[i]);
			}
			net.req(formData, url);
		},
		req : function(formData, url) {
			url = url || uploadPath;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.onload = function () {
				if (xhr.status === 200 || xhr.status === 201) {
					onSuccess(xhr.status, xhr);
				} else {
					onError(xhr.statuss, xhr);
				}
			};
			xhr.send(formData);
		}
		
	};
	
	
	/*
	 * $globals | Global variables
	 */
	var isActive = false;
	
	var el;
	var uploadPath    = '';
	var onDragStart   = utils.noop;
	var onDragOver    = utils.noop;
	var onDragLeave   = utils.noop;
	var onDrop        = utils.noop;
	var onSuccess     = utils.noopGeneric;
	var onError       = utils.noopGeneric;
	
	// Sets globals
	function setter(opts) {
		el = opts.el || document.getElementsByTagName('body')[0];
		uploadPath = opts.uploadPath || '/upload';
		
		if(utils.isFunction(opts.onDragStart)) {
			onDragStart = opts.onDragStart;
		}
		if(utils.isFunction(opts.onDragOver)) {
			onDragOver = opts.onDragOver;
		}
		if(utils.isFunction(opts.onDragLeave)) {
			onDragLeave = opts.onDragLeave;
		}
		if(utils.isFunction(opts.onDrop)) {
			onDrop = opts.onDrop;
		}
		
		if(utils.isFunction(opts.onSuccess)) {
			onSuccess = opts.onSuccess;
		}
		if(utils.isFunction(opts.onError)) {
			onError = opts.onError;
		}
	}
	
	
	/*
	 * $dnd | Drag and Drop functions
	 */
	var dnd = {
		
		traverseFileTree : function(entry, path) {
			path = path || "";
			if (entry.isFile) {
				console.log(entry);
				// Get file
				entry.file(function(file) {
					console.log(file);
				});
			} else if (entry.isDirectory) {
				
				// Get folder contents
				var dirReader = entry.createReader();
				dirReader.readEntries(function(entries) {
					for (var i=0; i<entries.length; i++) {
						traverseFileTree(entries[i], path + entry.name + "/");
					}
				});
			}
		}
		
	};
	
	
	/*
	 * $main | Main function
	 */
	var droplr = function(opts) {
		
		/* Setting options */
		opts = opts || {};
		setter(opts);
		
		/* Event functions */
		function dragstart(e) {
			onDragStart(e, this);
		}
		
		function dragleave(e) {
			onDragLeave(e, this);
		}
		
		function dragover(e) {
			onDragOver(e, this);
			return false;
		}
		
		function drop(e) {
			onDrop(e, this);
			var data = e.dataTransfer.getData('text');

			// For drops from other browser tabs
			// Still experimental
			if(data) {
				$.event.trigger('dnd:link', {
					link : data,
					extension : utils.getExtension(data)
				});
			} else {

				// For drops from desktop

				var entry = [];
				/*for (var i = 0; i < length; i++) {
					entry.push(e.dataTransfer.files);
					entry = e.dataTransfer.items[i].webkitGetAsEntry();
				}*/
				var files = e.dataTransfer.files;
				for(data in files) {
					entry.push(files[data]);
				}
				$.event.trigger('dnd:files', [e.dataTransfer.files]);
			}
			return false;
		}
		
		/* Public functions */
		function start() {
			if(!isActive) {
				
				el.addEventListener('dragstart', dragstart, false);
				el.addEventListener('dragleave', dragleave, false);
				el.addEventListener('dragover', dragover, false);
				el.addEventListener('drop', drop, false);
				
				isActive = true;
			}
		}
		
		function stop() {
			if(isActive) {
				
				el.removeEventListener('dragstart', dragstart, false);
				el.removeEventListener('dragleave', dragleave, false);
				el.removeEventListener('dragover', dragover, false);
				el.removeEventListener('drop', drop, false);
				
				isActive = false;
			}
		}
		
		function restart(opts) {
			stop();
			opts = opts || {};
			setter(opts);
			start();
		}
		
		
		return {
			start    : start,
			stop     : stop,
			restart  : restart,
			net      : net
		};
		
	};
	
	
	window.Droplr = droplr;
	
})(window, document);

