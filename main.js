/*jslint bitwise: true, unparam: true, maxerr: 50, white: true, nomen: true */
/*globals require, providers, exports, process */
/*!
 * crafity-config - Generic resource provider
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2011 Bart Riemens
 * Copyright(c) 2011 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('crafity-filesystem')
	, core = require('crafity-core')
	, objects = core.objects;

/**
 * Module name.
 */

exports.fullname = "crafity-resources";

/**
 * Module version.
 */

exports.version = '0.0.3';

/**
 * Loaded configuration
 */

var resources = {};

/**
 * Open a configuration
 * @param {String} path (Optional) The path to the config file
 * @param {Function} callback A callback called when config is loaded
 */

exports.configure = function (options, callback) {
	var path = fs.combine(process.cwd(), options.path);
	fs.getAllFilesWithContent(path, "*.json", function (err, files) {
		if (err) { return callback(err); }
		try {
			objects.forEach(files, function (fileContent, filename) {
				var filenameParts = filename.split('.')
					, namespace, language, parsedResource;

				if (filenameParts.length === 2) {
					namespace = "default";
					language = filenameParts[0]
				} else if (filenameParts.length === 3) {
					namespace = filenameParts[0];
					language = filenameParts[1]
				} else {
					throw new Error("Invalid resource file name '" + filename + "'");
				}

				resources[language] = resources[language] || {};
				resources[language][namespace] = resources[language][namespace] || {};
				try {
					parsedResource = JSON.parse(fileContent.toString());
				} catch (err) {
					throw new Error("Error while parsing resource file '" + filename + "'. " + err.toString())
				}
				objects.extend(resources[language][namespace], parsedResource);
			});
			function getResources(language, namespace) {
				language = language || options.defaultLanguage || "en";
				namespace = namespace || "default";
				if (!resources[language]) {
					throw new Error("Resource Language '" + language + "' is not available");
				}
				if (!resources[language][namespace]) {
					throw new Error("Resource Namespace '" + namespace + "' is not available");
				}

				var sixMonths = (((((1000 * 60) * 60) * 24) * 30) * 6);

				function resourceParser() {
					return function (req, res, next) {
						var redirect = !!(req.language = (req.url.match(/^(?:\/language\/)(\w+)(?:\/{0,1})/i) || [])[1]);
						var language = req.language = req.language || req.query.lang || req.cookies.lang || options.defaultLanguage || "en"
							, resources = req.resources = getResources(language)
							, languages = resources.getLanguages()
							, url = req.query["return"] || req.headers.referer || "/";

//						res.local("resources", resources);
//						res.local("language", language);
//						res.local("languages", languages);
						if (language) {
							res.cookie("lang", language, { path: "/", expires: new Date(Date.now() + sixMonths), httpOnly: true });
						} else {
							res.clearCookie('lang', { path: "/", expires: new Date(Date.now() + sixMonths) });
						}
						if (redirect) {
							if (req.query.layout) {
								url += (url.indexOf("?") > -1 ? "&" : "?") + "layout=" + req.query.layout;
							}
							res.redirect(url);
						} else {
							next();
						}
					}
				}

				function getLanguages() {
					return Object.keys(resources);
				}

				return {
					getResources: getResources,
					resourceParser: resourceParser,
					getLanguages: getLanguages,
					getLanguage: function () { return language; },
					get: function () {
						var result = resources[language][namespace]
							, args = Array.prototype.slice.call(arguments);
						args.forEach(function (arg) {
							if (result) {
								result = result[arg];
							}
						});
						return result || args.join(".");
					}
				};
			}

			return callback(null, getResources());
		} catch (err) {
			return callback(err);
		}
	});
};
