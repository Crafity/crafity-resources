# Crafity Resources [![Dependency status](https://david-dm.org/crafity/crafity-resources.png)](https://david-dm.org/crafity/crafity-resources) [![Travis Build Status](https://travis-ci.org/Crafity/crafity-resources.png?branch=master)](https://travis-ci.org/Crafity/crafity-resources) [![NPM Module version](https://badge.fury.io/js/crafity-resources.png)](http://badge.fury.io/js/crafity-resources)


## Preparation

Install crafity-resources module via NPM installer or by cloning this repository from GitHub:

### via NPM

```sh
$ npm install crafity-resources
```

### via GitHub
```sh
$ git clone https://github.com/Crafity/crafity-resources.git
$ cd crafity-resources
```

Before you start using it you must install all its dependencies. They are listed in ``package.json`` file under key ``dependencies``.
Install them first by running command on the terminal from ``crafity-resources`` as current directory:

```sh
$ npm install
```

After the dependencies have been installed, run the unit tests to check the sanity of the module. From the command line
and current directory ``crafity-resources`` type the command:

```sh
$ npm test
```


## Summary

``crafity-resources`` module delivers your Json formatted resource contents based on language and namespace.
Unit tested with 75% code coverage.


## Public API

Require resources module:


```js
var resources = require('../main.js')
	;
```

### resources.configure([options], callback);

* ``options`` String|Object Contains the path to the config file and a filter language
* ``callback`` Function A callback called when configuration is loaded

If you call the method with no ``options`` argument and a callback function, then the predefined default path and
language will be used. Here are the defaults:

```js
DEFAULT_CONFIG = {
		defaultPath: "/resources", 	// current directory
		defaultLanguage: "en",			// English
		defaultNamespace: "default"	// Default namespace
}
```

### Example 1
Consider you have resource files in folder ``resources`` in your application root: ``~/resources/en.json`` and ``~/resources/nl.json``.

```json
// path: '~/resources/en.json'
{
	"gender": {
		"male": "Male",
		"female": "Female",
		"unknown": "Unknown"
	}
}

// path: '~/resources/nl.json'
{
	"gender": {
		"male": "Man",
		"female": "Vrouw",
		"unknown": "Onbekend"
	}
}
```

If you call ``resources.configure`` without the first argument it delivers the contents of ``en.json``:


```js
resources.configure(function (err, resourcesAgent) {
	// check err
	
	var resourcesDataInEnglish = resourcesAgent.get();
	
});

```

### Example 2

If you call ``resources.configure`` and passing a configuration for "nl" language then it delivers the contents of ``nl.json``:

```js
var config = {                   
	"path": "/resources",        
	"defaultLanguage": "nl",
	"defaultNamespace": "default"
}                   


resources.configure(config, function (err, resourcesAgent) {
	// check err
	
	var resourcesDataInDutch = resourcesAgent.get();
	
});

```

### Example 3

What if you want to organize the reources from the same language group into namespaces and separate files for each namespace.
Your directory can look like ``/resources/en.json`` and ``/resources/crafity.en.json``:

```json
// path: '~/resources/en.json'
{
    "gender": {
        "male": "Male",
        "female": "Female",
        "unknown": "Unknown"
    }
}

// path: '~/resources/crafity.en.json'
{
	"people": {
		"female": "Galina",
		"male": "Bart"
	}
}

```

What ``crafity-resources`` does is scan all json files under the resources folder and construct a living resourcesData object
of the sort:

```json
{ 
	"en": { 
			"crafity": 
				{ "people": [Object] }, 
			"default": 
				{ "gender": [Object] } 
		} 
}
```


```js
resources.configure(function (err, resourcesAgent) {
	// handle err
	
	var customResources = resourcesAgent
		, crafityResources = resourcesAgent.getResources("en", "crafity")
		;
		
		// code ...
	}
);
```

