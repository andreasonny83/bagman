[bagman.js](https://github.com/mhrisse/bagman)

## Overview

The [bagman](http://en.wikipedia.org/wiki/Bagman) does the dirty work for your Javascript multipage projects.

He finds out which modules are on the page and lazy load and 
evaluates your modular Javascript ([AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)) accordingly. He is handy for
multi-page projects such as large corporate websites managing tons of content where you do not know
on the server during HTML-rendertime which Javascript you will need 
on the page and you figured that your script.js spaghetti-file is far beyond 3000 lines. 
Of course, this simple module is in AMD format itself - presto!

The Bagman supports lazyloading of modules not in viewport
at the time of page initialization which can speed up loading time,
especialy on mobile devices with small screens and slow processors.
 
He utilizes almond.js and [require.js](https://requirejs.org) AMD loaders by calling `require()` for modules
being in use. Looks familiar? Onepager Frameworks such as Angular or Knockout also utilize this pattern (in a different way tho) to keep your code readable. Currently
designed to work with Almond or RequireJS, but will soon also work with other loaders such as Cloudflare.JS, curl.js or [The Dojo Loader](http://dojotoolkit.org/reference-guide/1.9/loader/).

## Dependencies
* jQuery 1.7+
* AMD Loader (almond or requirejs)

## Features
* Viewport support
* Configuration

## Install
Download this git repository or use the [bower](https://bower.io) package manager:

```javascript
bower install bagman
```

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