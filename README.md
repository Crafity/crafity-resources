#Crafity Resources [![Dependency status](https://david-dm.org/crafity/crafity-resources.png)](https://david-dm.org/crafity/crafity-resources) [![Travis Build Status](https://travis-ci.org/Crafity/crafity-resources.png?branch=master)](https://travis-ci.org/Crafity/crafity-resources) [![NPM Module version](https://badge.fury.io/js/crafity-resources.png)](http://badge.fury.io/js/crafity-resources)


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

crafity-logging module 

... ... .. 


## Public API

Require resources module:


```js
var resources = require('../main.js')
	;
```

### resources.configure([options], callback);

* ``options`` String|Object The path to the config file
* ``callback`` Function A callback called when config is loaded

Consider the following example:

```json
// configurarion
{                   
	"path": "/resources",        
	"defaultLanguage": "nl"      
}                   
```

```js

```

Result resources object:

```json
{ en: { default: { gender: [Object] } }, nl: { default: {} } }

```

