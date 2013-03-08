bagman (alpha)
======

### Overview
Not every project - especially legacy ones which massive content - can be a fancy onepage webapp. Bagman is a tiny AMD-module to do the dirty work for you and get some structure into the Javascipt mess most projects suffer from.

It is designed to assist you with lazy-loading and evaluation of your AMD Javascript modules on a normal webage. This is done in the most simple way possible: by writing something like `<div data-foo-module="bar">` in your valid HTML5 code. Bagman will utilize an AMD loader to initialize the module and give you an instance for each occurance. Should not surprise other frameworks such as Angular or Knockout do it the same way.
Designed to work with Almond or RequireJS. 

### Documentation
TBD

### License
Bagman has been created and maintained by 
Matthias H. Risse ([@mhrisse](http://twitter.com/mhrisse)) and is available
under the open-source MIT license.

### Coming Up
* Viewport support
* PJAX support
* Support more AMD loaders
