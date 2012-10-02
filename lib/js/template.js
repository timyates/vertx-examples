var Mustache = require('lib/js/mustache.js');

var template = (typeof module !== 'undefined' && module.exports) || {};

/**
 * Render a template with mustache.
 * @param {vertx.Request} req
 * @param {string} template
 * @param {object} context
 */
template.renderTemplate = function (req, template, context) {
    vertx.fileSystem.readFile(template, function (err, file) {
        req.response.headers()['Content-Type'] = 'text/html';
        req.response.end(Mustache.render(file.getString(0, file.length()), context));
    });
}