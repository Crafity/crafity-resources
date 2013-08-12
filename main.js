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


	, DEFAULT_CONFIG = {
		defaultPath: "/resources", 	// current directory
		defaultLanguage: "en",			// English
		defaultNamespace: "default"	// Default namespace
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

module.exports.version = '0.1.4';

/**
 * Constructor.
 * @param resourcesData
 * @param language
 * @param namespace
 * @constructor
 */
function ResourcesAgent(resourcesData, language, namespace) {
	if (!resourcesData || (resourcesData && typeof resourcesData !== "object")) {
		throw new Error("Expected ResourceData.");
	}
	if (!language) {
		throw new Error("Expected argument language.");
	}
	if (!namespace) {
		throw new Error("Expected argument namespace.");
	}

	if (!resourcesData[language]) {
		throw new Error("Resource Language '" + language + "' is not available");
	}
	if (!resourcesData[language][namespace]) {
		throw new Error("Resource Namespace '" + namespace + "' is not available");
	}

	// returna a new instance of ResourcesAgent
	this.getResources = function createNewResourceAgent(language, namespace) {
		return new ResourcesAgent(resourcesData, language, namespace);
	};

	// extract this object to another more appropriate module file TODO
	// not the crafity-resources, but crafity.http. resources
	this.resourceParser = function resourceParser() {
		var SIX_MONTHS = (((((1000 * 60) * 60) * 24) * 30) * 6)
			;

		return function requestListener(req, res, next) {

			var languageFromUrl = (req.url.match(/^(?:\/language\/)(\w+)(?:\/{0,1})/i) || [])[1]
				, languageFromRequest = languageFromUrl || req.query.lang || req.cookies.lang || language
				, mustRedirect = languageFromUrl && true // test this TODO
				, resourceAgent = new ResourcesAgent(resourcesData, languageFromRequest, namespace)
				, url = req.query["return"] || req.headers.referer || "/"
				;

			// the leading language variable for now!
			req.language = languageFromRequest;
			req.resources = resourceAgent;

			res.local("resources", resourceAgent); // wat willen we hiermee
			res.local("languages", resourceAgent.getLanguages()); // wat willen we hiermee
			res.local("language", languageFromRequest);

			if (languageFromRequest) {
				res.cookie("lang", languageFromRequest, { path: "/", expires: new Date(Date.now() + SIX_MONTHS), httpOnly: true });
			} else {
				res.clearCookie('lang', { path: "/", expires: new Date(Date.now() + SIX_MONTHS) });
			}

			if (mustRedirect) {
				if (req.query.layout) {
					url += (url.indexOf("?") > -1 ? "&" : "?") + "layout=" + req.query.layout;
				}
				res.redirect(url);
			} else {
				next();
			}
		};
	};

	this.getLanguages = function getLanguages() {
		return Object.keys(resourcesData);
	};

	this.getLanguage = function getLanguage() {
		return language;
	};

	this.get = function get() {
		var result = resourcesData[language][namespace]
			, args = Array.prototype.slice.call(arguments);

		
		args.forEach(function (arg) {
			if (result) {
				result = result[arg];
			}
		});
		return result || args.join(".");
	};

}

/**
 * Open a configuration
 * @param {Object|Function} [options] (Optional) The path to the config file
 * @param {Function} callback A callback called when config is loaded
 */
module.exports.configure = function (options, callback) {
	if (arguments.length === 0) {
		throw new Error("Insufficient number of arguments. At least one callback argument is required.");
	}
	if (arguments.length < 2) {
		callback = options;
		options = null;
	}

	var resourcesData = {};
	options = options || DEFAULT_CONFIG;
	options.path = options.path || DEFAULT_CONFIG.defaultPath;
	options.defaultLanguage = options.defaultLanguage || DEFAULT_CONFIG.defaultLanguage;
	options.defaultNamespace = options.defaultNamespace || DEFAULT_CONFIG.defaultNamespace;

	// obtain all files with json extension
	fs.getAllFilesWithContent(fs.combine(process.cwd(), options.path), "*.json", function fsLoadResourceFilesCallback(err, files) {
		if (err) {
			return callback(new Error("No resource json files are found. Original error: " + err));
		}
		if (Object.keys(files).length === 0) {
			return callback(new Error("No resource json files were found."));
		}

		try {

			objects.forEach(files, function (fileContent, filename) {
				var filenameParts = filename.split('.')
					, namespace
					, language
					, loadedResourceData;

				if (filenameParts.length === 2) {
					namespace = "default";
					language = filenameParts[0];

				} else if (filenameParts.length === 3) {

					namespace = filenameParts[0];
					language = filenameParts[1];

				} else {
					throw new Error("Invalid resource file name '" + filename + "'"); // unit test this! TODO
				}

				// initialization trick: if resourceData = {} => resourceData = { <language>: {} }
				resourcesData[language] = resourcesData[language] || {};
				resourcesData[language][namespace] = resourcesData[language][namespace] || {};

				try {

					loadedResourceData = JSON.parse(fileContent.toString());

				} catch (err) {

					throw new Error("Error while parsing resource file '" + filename + "'. " + err.toString());
				}

				// shallow copy of all properties to destinationArg from sourceArg 
				objects.extend(resourcesData[language][namespace], loadedResourceData);
			});

		} catch (err2) {

			return callback(err2);
		}

		// happy flow
		return callback(null, new ResourcesAgent(resourcesData, options.defaultLanguage, options.defaultNamespace));

	});
}
;

// exposed in outer scope for unit testing
module.exports.ResourcesAgent = ResourcesAgent;