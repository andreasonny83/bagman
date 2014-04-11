[Bagman](http://en.wikipedia.org/wiki/Bagman) - your modular javascript delivery boy.

## Overview

Finds out which modules are on the page and lazyloads, 
evaluates, instanciates and initializes the Javascript modules
using AMD/requirejs accordingly. Supports easy cross-module communication. 

Handy for classic multi-page projects using requirejs
with a CMS. Battle-tested with a 100+ million visitors / month 
Wordpress site. 

## Dependencies
* jQuery 1.7+
* AMD Loader (almond or requirejs)

## Features
* Viewport support
* Configuration

## Install
Download this git repository or use 
[bower](https://bower.io)

Install bower
```javascript
npm install -g bower
```

Then install bagman
```javascript
bower install bagman
```


## Example

### HTML
```html
<div data-module="slider"> <!-- more of your html code --> </div>
```

### JS

Setup is fairly easy. In your main file (usually main.js or app.js) , where you setup requirejs
configuration, simple set certain variables if you the standard does not suit you or your
project / html5-markup.

```javascript
require.config({
	"config": {
		// configuring bagman
        "bagman": {
            "container": "body", // search the whole body
            "hook": "module", // look e.g. for data-module="slider"
			"config": "config" // use data-config="{ ..json .. }" for further configuration of the module
        }
    }
});
```

That done, you invoke/load all modules to be loadaed on every pagerequest.

```javascript
require(
	[
		'jquery',
		'bagman'
	]
);
```

When the Javascript parser hits e.g. a `<div data-module='slider' data-config='{ "color": "blue" }'>` it will load the AMD-module
called `slider` and then tries to call a .init function, passing in the domNode (jQuery object) as the 
first argument and e.g. the contents of `data-config`. I personally often find it handy to pass in a JSON object to configure
the module instance, but it can be virtually anything that can be represented as a string. 

## API
TBD

## License
Bagman is licensed under the open-source MIT license.
Ideas, critique and improvements welcome!
[@mhrisse](http://twitter.com/mhrisse)