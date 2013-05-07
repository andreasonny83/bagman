[bagman.js](https://github.com/mhrisse/bagman)

## Overview
Find out which modules are on the page and lazy load and 
evaluate your modular Javascript (AMD) accordingly. Handy for
multi-page projects such as corporate websites where you do not know
on the server during html-rendertime which javascript you will need 
on the page.

Supports lazyloading of modules not in viewport
at the time of page initialization which can speed up loading time,
especialy on mobile devices with small screens and slow processors.
 
Utilizes almond.js and require.js AMD loaders by calling require() for modules
being in use. Looks familiar? Onepager Frameworks such as Angular or Knockout also utilize this pattern (in a different way tho) to keep your code readable. Designed to work with Almond or RequireJS. 

## Dependencies
* jQuery 1.7+
* AMD Loader (almond or requirejs)

## Features
* Viewport support

## Coming Up
* Anonymized module
* PJAX support
* Support more AMD loaders


## Example

### HTML
```html
<div data-module="slider"> <!-- more of your html code --> </div>
```

### JS

#### in your main.js or app.js file where you setup requirejs

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

// everything set. let's go.
// invoke/load all modules to be loadaed on every pagerequest
```javascript
require(
	[
		'jquery',
		'bagman'
	]
);
```

## API
TBD

## License
Bagman is licensed under the open-source MIT license.
Ideas, critique and improvements welcome!
[@mhrisse](http://twitter.com/mhrisse)