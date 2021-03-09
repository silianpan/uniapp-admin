/**!
 * h5uploader.js
 * This is a simple file upload plugin depends on HTML5. 
 * You can use it to mordern browser.
 * 
 * version: 1.0
 * Copyright 2015, Ziv | http://imziv.com
 * Released under the MIT License
 * https://github.com/wewoor/h5uploader
 **/

(function(window) {

	window.H5Uploader = (function() {

		function createXhr() {
			if (typeof XMLHttpRequest != "undefined") {
				return new XMLHttpRequest();
			} else if (typeof ActiveXObject != "undefined") {
				if (typeof arguments.callee.activeXString != "string") {
					var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
					for (var i = 0, len = versions.length; i < len; i++) {
						try {
							new ActiveXObject(versions[i]);
							arguments.callee.activeXString = versions[i];
							break;
						} catch (e) {
							throw new Error('Create XHR ActiveXObject error.' + e);
						}
					}
				}
				return new ActiveXObject(arguments.callee.activeXString);
			} else throw new Error('No XHR object avaliable.' + e);
		}

		return {
			upload: function(literals) {
				if (Object.prototype.toString.call(literals) !== '[object Array]') {
					this.handUpload(literals);
				} else {
					for (var i = 0; i < literals.length; i++) {
						this.handUpload(literals[i]);
					}
				}
			},

			handUpload: function(literals) {

				if (literals.action === undefined) {
					throw new Error('The upload action address option is undefined.');
				}

				var xhr = createXhr();
				xhr.open("POST", literals.action, true);
				xhr.setRequestHeader("Content-Type", "multipart/form-data");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
						var body = xhr.responseText;
						if (xhr.status >= 200 && xhr.status < 300 ||
							xhr.status == 304) {
							if (literals.success) {
								literals.success(body);
							}
						} else {
							if (literals.fail) {
								literals.fail(body);
							}
						}
					}
				};
				var data = new FormData();
				if (!literals.id) {
					throw new Error('The upload id option is undefined.');
				}
				var file = document.getElementById(literals.id);
				if (!file) {
					throw new Error('The upload file element is undefined::id:' + literals.id);
				}
				var name = file.getAttribute('name');
				if (!name) {
					throw new Error('The upload file input name is undefined.');
				}

				if (literals.size) { // Check file Size
					var evt = this.checkSize(file.files, literals.size.max);
					if (evt) {
						if (literals.size.valide) literals.size.valide(evt);
						throw new Error('The upload file size exceed max value.');
					}
				}

				if (literals.type) { // Check file type
					var evt1 = this.checkType(file.files, literals.type.name);
					if (evt1) {
						if (literals.type.valide) literals.type.valide(evt1);
						throw new Error('The upload file type is error.');
					}
				}

				if (literals.progress) { // Progress
					literals.progress();
				}

				for (var i = 0; i < file.files.length; i++) {
					data.append(name, file.files[i]);
				}

				try {
					xhr.send(data);
				} catch (e) {
					throw new Error(e);
				}
			},

			// Validate file size
			checkSize: function(file, size) {
				for (var i = 0; i < file.length; i++) {
					if (file[i].size > size * 1024) { // bytes
						return file[i];
					}
				}
			},

			// Validate file type
			checkType: function(file, type) {
				for (var i = 0; i < file.length; i++) {
					var arr = file[i].name.split(".");
					if (type.indexOf(arr[arr.length - 1]) === -1) {
						return file[i];
					}
				}
			}
		};
	})();

})(window);
