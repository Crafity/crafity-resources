/*jslint node: true, white: true */
"use strict";

/*!
 * crafity-config - Tests for the configuration functionality
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Bart Riemens
 * Copyright(c) 2013 Galina Slavova
 * MIT Licensed
 */

/**
 * Test dependencies.
 */

var jstest = require('crafity-jstest').createContext("Crafity Resources Tests")
	, assert = jstest.assert
	;

/**
 * Run the tests
 */

jstest.run({

//	"TEST #1": function (test) {
//		test.async(2000); // give the timeout for this unit test to complete
//
//		// arrange
//		var resources = require('../main.js');
//
//		// act
//		resources.configure({ path: "/resources1", defaultLanguage: "nl"}, function (err, resourcesObject) {
//				console.log("err", err);
//				console.log("resourcesObject", resourcesObject);
//				
//				test.complete();
//			}
//		);
//	},
//	"TEST #2": function (test) {
//		test.async(2000); // give the timeout for this unit test to complete
//
//		// arrange
//		var resources = require('../main.js');
//
//		// act
//		resources.configure({ path: "/resources2", defaultLanguage: "en"}, function (err, resourcesObject) {
//				console.log("err", err);
//				console.log("resourcesObject", resourcesObject);
//				
//				test.complete();
//			}
//		);
//	},
//	"TEST #3": function (test) {
//		test.async(2000); // give the timeout for this unit test to complete
//
//		// arrange
//		var resources = require('../main.js');
//
//		// act
//		resources.configure(function (err, resourcesObject) {
//				console.log("err", err);
//				console.log("resourcesObject", resourcesObject);
//				
//				test.complete();
//			}
//		);
//	},

	"#1 When requiring the resources module Then a result of type Function is returned.": function () {
		var resources = require('../main.js');

		assert.isDefined(resources, "Expected resources to be defined.");
		assert.isFunction(resources.configure, "Expected to have configure function.");
	},

	"#2 When calling configure method with no arguments Then an error is returned.": function () {
		// arrange
		var resources = require('../main.js');

		assert.isDefined(resources, "Expected resources to be defined.");
		// act

		try {
			resources.configure();
			assert.fail("Expected an exception to be thrown.");
		} catch (err) {

			console.log("err", err);

			// assert
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");

		}

	},
	"#99 When calling constructor ResourcesAgent Then ...": function () {
// arrange
		var resources = require('../main.js');

		try {
			new resources.ResourcesAgent().get();
			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			console.log("err", err);
			
			assert.isDefined(err, "Expected err to be defined.");
			assert.areEqual("Expected argument language.", err.message, "Expected err error messaged to be the same.");
			assert.isNotNull(err, "Expected err to be defined.");

		}
	},

	"#3 When calling configure method with no options and existing '~/resources/en.json' path Then default language is English.": function (test) {
		test.async(2000); // give the timeout for this unit test to complete

		// arrange
		var resources = require('../main.js');

		// assert
		assert.isDefined(resources, "Expected resources to be defined.");

		// act
		resources.configure(function (err, resourcesObject) {
				// assert
				assert.isNull(err, "Expected that no error should be thrown.");
				assert.isDefined(resourcesObject, "Expected resources result to be defined.");

				assert.areEqual(1, resourcesObject.getLanguages().length, "Expected the resources to have one default language.");
				assert.isTrue(resourcesObject.getLanguages()[0] === "en", "Expected the default language to be English.");

				test.complete();
			}
		);
	},

	"#4 When calling configure method with an invalidly formatted json file as an argument Then an error is returned.": function (test) {
		test.async(1000); // give the timeout for this unit test to complete

		// arrange
		var resources = require('../main.js');

		assert.isDefined(resources, "Undefined resoucres");

		// act
		try {

			resources.configure({ path: '/resources1', "defaultLanguage": "nl" }, function (err) {
				console.log("#3");
				console.log("\nerr = ", err);

				// assert
				assert.isDefined(err, "Expected err to be defined.");
				assert.isNotNull(err, "Expected err to be defined.");

				test.complete();
			});

		} catch (ex) {
			console.log("ex", ex);
		}

	},

	"#5 When calling configure method with a custom file path with no files underneath Then an error is returned.": function (test) {
		test.async(2000); // give the timeout for this unit test to complete

		// arrange
		var resources = require('../main.js');

		// act
		resources.configure({ path: '/resources4' }, function (err) {
//					console.log("err", err);
				// assert
				assert.isNotNull(err, "Expected err to be defined.");

				test.complete();
			}
		);
	},
//
//	"#6 When defining a crafity namespace file under 'resources' folder Then the result json contains two nested objects with namespaces as keys.": function (test) {
//		test.async(2000);
//
//		// arrange
//		var resources = require('../main.js');
//
//		// act
//		resources.configure(function (err, resourcesResult) {
//				console.log("err", err);
//				console.log("\nresourcesResult= ", resourcesResult);
//
//				var crafityResources = resourcesResult.getResources("en", "crafity").get()
//					, defaultResources = resourcesResult.getResources("en", "default").get()
//					;
//
//				console.log("crafityResources = ", crafityResources);
//				console.log("defaultResources = ", defaultResources);
//
//				assert.isDefined(crafityResources, "Expected crafityResources to be defined.");
//				assert.isDefined(defaultResources, "Expected defaultResources to be defined.");
//
//				test.complete();
//			}
//		);
//	}

});



