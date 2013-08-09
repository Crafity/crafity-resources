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
 * Run the tests.
 */
jstest.run({

	"#1 When requiring the resources module Then a result of type Function is returned.": function () {
		var resources = require('../main.js');

		assert.isDefined(resources, "Expected resources to be defined.");
		assert.isFunction(resources.configure, "Expected to have configure function.");
	},

	"#2 When calling configure method with no arguments Then an error is returned.": function () {
		// arrange
		var resources = require('../main.js');

		assert.isDefined(resources, "Expected resources module to be defined.");
		// act

		try {
			resources.configure();
			assert.fail("Expected an exception to be thrown.");

		} catch (err) {

			// assert
			assert.isDefined(err, "Expected err to be defined.");
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
		resources.configure(function (err, resourcesAgent) {
				// assert
				assert.isNull(err, "Expected that no error should be thrown.");
				assert.isDefined(resourcesAgent, "Expected resources result to be defined.");

				assert.areEqual(1, resourcesAgent.getLanguages().length, "Expected the resources to have one default language.");
				assert.isTrue(resourcesAgent.getLanguages()[0] === "en", "Expected the default language to be English.");

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
				// assert
				assert.isNotNull(err, "Expected err to be defined.");

				test.complete();
			}
		);
	},

	"#6 When calling ResourcesAgent method getResources with legitimate language and namespace Then the .": function (test) {
		test.async(2000);

		// arrange
		var resources = require('../main.js');

		// act
		resources.configure({ defaultLanguage: "en"}, function (err, resourcesAgent) {
				var customResourcesData = resourcesAgent.get()
					, crafityResourcesData = resourcesAgent.getResources("en", "crafity").get()
					;

				console.log("err = ", err);
//				console.log("Object.keys(customResourcesData)[0]", Object.keys(customResourcesData)[0]);

				// assert
				assert.isDefined(customResourcesData, "Expected customResourcesData to be defined.");
				assert.isDefined(crafityResourcesData, "Expected crafityResourcesData to be defined.");

				assert.isTrue((Object.keys(customResourcesData)[0] === "gender"), "Expected customResourcesData to containg namespace key 'gender'.");
				assert.isTrue((Object.keys(crafityResourcesData)[0] === "people"), "Expected crafityREsources to namespace contain key 'people'.");
				
				test.complete();
			}
		);
	},

	"#7 When calling constructor of ResourcesAgent without parameters Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent();
			console.log("instantiated", instantiated);
			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Expected ResourceData.", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#8 When calling constructor of ResourcesAgent with resourcesData as only parameter Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent({  });
			console.log("instantiated", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Expected argument language.", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#9 When calling constructor of ResourcesAgent with resourcesData and language as parameters Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent({  }, "en");
			console.log("instantiated", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Expected argument namespace.", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#10 When calling ResourcesAgent with resourcesData with unknown language as parameters Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent({  }, "en");
			console.log("instantiated", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Expected argument namespace.", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#11 When calling ResourcesAgent with resourcesData as string parameter Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent("en");
			console.log("instantiated", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Expected ResourceData.", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#12 When calling ResourcesAgent with resourcesData as parameter containing unknown language Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent({ "fr": { "default": { "key1": "eclair" } } }, "en", "namespace"); //.get();
			console.log("instantiated", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Resource Language 'en' is not available", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#13 When calling ResourcesAgent with resourcesData as parameter containing known language nut unknown namespace Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js');

		try {
			var instantiated = new resources.ResourcesAgent({ "en": { "default": { "key1": "value1" } } }, "en", "namespace"); //.get();
			console.log("instantiated = ", instantiated);

			assert.fail("Expected an exception to be thrown.");
		}
		catch (err) {
			assert.isDefined(err, "Expected err to be defined.");
			assert.isNotNull(err, "Expected err to be defined.");
			assert.areEqual("Resource Namespace 'namespace' is not available", err.message, "Expected err error messaged to be the same.");
		}
	},

	"#14 When creating ResourcesAgent with valid arguments and calling get method Then an error must be returned.": function () {
		// arrange
		var resources = require('../main.js')
			, testResourcesData = { "key1": "value1" }
			;

		// act
		var resourcesObjectResult = new resources.ResourcesAgent({ "en": { "default": testResourcesData } }, "en", "default").get();

		// assert
		assert.areEqual(resourcesObjectResult, testResourcesData, "Expected both objects to be the same.");

	},

	"#15 When creating ResourcesAgent with valid arguments and calling getLanguage method Then string value is returned.": function () {
		// arrange
		var resources = require('../main.js')
			, testResourcesData = { "key1": "value1" }
			;

		// act
		var defaultLanguageResult = new resources.ResourcesAgent({ "en": { "default": testResourcesData } }, "en", "default").getLanguage();

		// assert
		assert.isTrue(typeof defaultLanguageResult === "string", testResourcesData, "Expected both objects to be the same.");

	},

	"#16 When creating ResourcesAgent with valid arguments and calling resourceParser method Then Function is returned.": function () {
		// arrange
		var resources = require('../main.js')
			, testResourcesData = { "key1": "value1" }
			, defaultLanguageResult = new resources.ResourcesAgent({ "en": { "default": testResourcesData } }, "en", "default")
			;

		// act
		var resourcesObjectResult = defaultLanguageResult.resourceParser();

		// assert
		assert.isTrue(resourcesObjectResult instanceof Function, "Expected both objects to be the same.");

	}
});



