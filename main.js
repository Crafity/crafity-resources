/*jslint node: true, white: true */
"use strict";

/*!
 * crafity-resources - Library to easily work with multilingual resource files in NodeJS
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('crafity-filesystem')
	, core = require('crafity-core')
	, objects = core.objects
	, config =
	{
		path: "/resources" 	// current directory
		, defaultLanguage: "en"  										// English
	}
	;

module.exports = {};

/**
 * Module name.
 */

module.exports.fullname = "crafity-resources";

/**
 * Module version.
 */

module.exports.version = '0.1.1';

/**
 * Loaded configuration
 */

var resources = {};

/**
 * Open a configuration
 * @param {String|Object} options (Optional) The path to the config file
 * @param {Function} callback A callback called when config is loaded
 */
module.exports.configure = function (options, callback) {
	if (arguments.length === 0) {
		throw new Error("Insufficient number of arguments. At least one callback argument is required.");
	}

	if (arguments.length < 2) {
		callback = options;
		options = config;
	}

	var path = (options !== null) ? fs.combine(process.cwd(), options.path) : config.path;
//	console.log("TEST _ path= ", path);

	// obtain all files with json extension
	fs.getAllFilesWithContent(path, "*.json", function (err, files) {
		
		if (err) {
			return callback("No resource json files are found. Original error: " + err);
		}
		if (Object.keys(files).length === 0) {
			return callback("No resource json files were found.");
		}

		// define a getter
		var getResources = function getResources(language, namespace) {
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

					var redirect = false
						, parserLanguage
						, url;

					req.language = (req.url.match(/^(?:\/language\/)(\w+)(?:\/{0,1})/i) || [])[1];
					if (req.language) {
						redirect = true;
					}

					parserLanguage = req.language = req.language || req.query.lang || req.cookies.lang || options.defaultLanguage || "en";
					url = req.query["return"] || req.headers.referer || "/";

					if (parserLanguage) {
						res.cookie("lang", parserLanguage, { path: "/", expires: new Date(Date.now() + sixMonths), httpOnly: true });
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
				};
			}

			function getLanguages() {
				return Object.keys(resources);
			}

			return {

				getResources: getResources,
				resourceParser: resourceParser,
				getLanguages: getLanguages,

				getLanguage: function () {
					return language;
				},

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

		};

		try {

			objects.forEach(files, function (fileContent, filename) {

				var filenameParts = filename.split('.')
					, namespace, language, parsedResource;

//				console.log("filenameParts[0]", filenameParts[0]);
//				console.log("filenameParts[1]", filenameParts[1]);
				if (filenameParts.length === 2) {
					namespace = "default";
					language = filenameParts[0];

				} else if (filenameParts.length === 3) {

					namespace = filenameParts[0];
					console.log("filenameParts[2]", filenameParts[2]);
					language = filenameParts[1];

				} else {
					
					throw new Error("Invalid resource file name '" + filename + "'");
				}

				resources[language] = resources[language] || {};
				resources[language][namespace] = resources[language][namespace] || {};

				console.log("resources[language] = ", resources[language]);
				console.log("resources[language][namespace] = ", resources[language][namespace]);
				try {

					parsedResource = JSON.parse(fileContent.toString());

				} catch (err) {

					throw new Error("Error while parsing resource file '" + filename + "'. " + err.toString());
				}
				
				objects.extend(resources[language][namespace], parsedResource);
			});

		} catch (err2) {

			return callback(err2);
		}

		console.log("\nTEST = resources = ", resources);
		return callback(null, getResources());
	});
};
