bagman (alpha)
======

### Overview
Not every project - especially legacy ones which come with massive content and no clean MVC pattern - can be refactored into a fancy onepage webapp. Bagman is a tiny AMD-module to do the dirty work for you and get some structure into the Javascipt mess most projects suffer from.

It is designed to assist you with lazy-loading and evaluation of your AMD Javascript modules on a normal webage. This is done in the most simple way possible: by writing something like `<div data-foo-module="bar">` in your valid HTML5 code. Bagman will utilize an AMD loader to initialize the module and give you an instance for each occurance. Looks familiar? Frameworks such as Angular or Knockout also utilize this pattern (in a different way tho) to keep your code readable.
Designed to work with Almond or RequireJS. 

### Dependencies
* jQuery
* RequireJS or Almond
* Underscore

### Documentation
TBD

### License
Bagman is licensed under the open-source MIT license.
Ideas? [@mhrisse](http://twitter.com/mhrisse)

### Coming Up
* Viewport support
* PJAX support
* Support more AMD loaders
* Drop dependencies
