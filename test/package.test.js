/*jslint node:true, white:true */
/*!
 * package.test - package.json tests
 * Copyright(c) 2011 Crafity
 * Copyright(c) 2012 Galina Slavova
 * Copyright(c) 2012 Bart Riemens
 * MIT Licensed
 */

/**
 * Test dependencies.
 */
var jstest = require('crafity-jstest')
	, assert = jstest.assert
	, context = jstest.createContext()
	, fs = require('crafity-filesystem')
	, main = require('../main')
	;

(function packageTests() {
	"use strict";

// Print out the name of the test module
	console.log("Testing 'package.json' in current module... ");

	/**
	 * The tests
	 */
	var tests = {

		'The module must have package.json file': function () {

			fs.readFile("./package.json", function (err, data) {
				assert.isDefined(data, "Expected package.json defined");
			});
		},
		'The module must have the same version as quoted in package.json': function () {

			fs.readFile("./package.json", function (err, data) {
				var json = JSON.parse(data.toString());
				console.log("package.version =", json.version);

				assert.isDefined(json.version, "Expected fs to be defined");
				assert.areEqual(main.version, json.version, "Expected the same module version!");
			});
		}

	};

	/**
	 * Run the tests
	 */
	context.run(tests);

}());
