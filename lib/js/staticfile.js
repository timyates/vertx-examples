var vertx = require('vertx.js');

var staticfile = (typeof module !== 'undefined' && module.exports) || {};

staticfile.setStaticFiles = function (files, routeMatcher) {
	var types = {
		css: 'text/css',
		js: 'text/javascript',
		jpg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif'
	};

	for (var k in files) {
		if (!files.hasOwnProperty(k)) continue;

		(function (k) {
			var type = types[k.split('.').pop()];
			vertx.fileSystem.readFile(files[k], function (err, buffer) {
				routeMatcher.get(k, function (req) {
					req.response.headers()['Content-Type'] = type;
					req.response.end(buffer);
				});
			});
		})(k);
	}
};