/*
 * Bagman - your modular javascript delivery boy
 * 
 * Finds out which modules are on the page and lazyloads, 
 * evaluates, instanciates and initializes the Javascript modules
 * using AMD/requirejs accordingly. Supports easy cross-module communication. 
 *
 * Handy for classic multi-page projects using requirejs
 * with a CMS. Battle-tested with a 100+ million visitors / month 
 * Wordpress site. 
 *
 * @url https://github.com/mhrisse/bagman
 * @author risse@risse.org (@mhrisse)
 * @license: MIT
 * @version 0.2.3
 *
 */

define(
	'bagman',
	['jquery', 'module'],
	function ($, module) {
		"use strict";

		// defaults + definitions
		var config = {
				"container": "body", // jquery selector
				"hook": "module", // module in data-module
				"config": "config", // config in data-config
				"global": false, // expose pub as global variable
				"debug": false  // debug mode (green = loaded/invoked on pageload, orange = loading & invokation delayed after onload)
			},
			selector = '',
			moduleQuery = {},
			inViewport = [],
			notInViewport = [],
			modules = [],
			loaded = 0,
			priv = {},
			pub = {},
			helperId = 0,
			uid = 0;

		// set configuration (if any)
		$.extend(config, module.config());

		selector = '*[data-' + config.hook + ']';

		// get modules on page
		moduleQuery = $(config.container).find(selector);

		// public API
		pub.onloadDone = false;
		pub.debug = config.debug;

		/*
		 * Publically accessible data
		 */
		pub.modules = [];
		pub.instances = [];

		/*
		 * Init
		 */
		pub.init = function () {
			// Mark modules which are inViewport
			$.each(moduleQuery, function (index, value) {
				// ViewPort detection might not work in IE8 and below properly, so we exluce the old browsers for now.
				if ($.browser.msie === true && $.browser.version < 9.0) {
					priv.instanciate($(value).data(config.hook), value, $(value).data(config.config));
				} else {
					if (priv.elementInViewport(value)) {
						inViewport.push(value);
						value.inViewport = true;
						priv.instanciate($(value).data(config.hook), value, $(value).data(config.config));
					} else {
						notInViewport.push(value);
						value.inViewport = false;
					}
				}
			});

			// Delay init of module not in viewport until onload has fired
            $(window).load(function () {
				pub.onloadDone = true;

				$.each(notInViewport, function (index, value) {
					priv.instanciate($(value).data(config.hook), value, $(value).data(config.config));
				});
            });

            return pub;
		};

		/*
		 * get module instance for given domNode
		 * 
		 * @param domNode object DomNode to search below
		 * @return object Returns the corresponding module object or null.
		 */
		pub.getInstance = function (domNode) {
			var id = $(domNode).attr('data-instance-id');
			if(pub.instances[id]) {
				return pub.instances[id];
			} else {
				return null;
			}
		};

		/*
		 * Get all modules instances of given domNode (that is modules nested inside the given DOM Node)
		 * 
		 * @param domNode object DomNode to search below
		 * @param type string module to search for. This is basically filtering the result for a certain module type sich as sonyplayer
		 * @return void
		 */
		pub.getInstances = function (domNode, type) {
			// find all nested modules
			var query = '*[data-module]',
				nodes = [],
				result = [];
			
			// filter for module type
			if(type) {
				query = '*[data-module="' + type + '"]';
			}

			nodes = $(domNode).find(query);

			// loop thru them and transform data-instance-id into a true module reference
			$.each(nodes, function (index, value) {
				var instance = pub.instances[$(value).attr('data-instance-id')];
				if(instance !== undefined) {
					result.push(instance);
				}
			});

			return result;
		};

		/*
		 * Rescan the HTML and dispose all modules not longer on the page.
		 * Important for PJAX, so we do not keep modules unnecessarily in memory.
		 */
		pub.update = function () {
			// todo 
			// uses delete()
		};

		/*
		 * Remove a given module and all its data
		 * in memory
		 */
		pub.remove = function (index) {
			// todo 
		};

		/*
		 * Very simple method to find out if the given DomNode is currently in viewport
		 * 
		 * @param el object DomNode
		 * @url http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		 * @return boolean
		 */
		priv.elementInViewport = function (el) {
			var rect = el.getBoundingClientRect();
			return rect.top < (window.innerHeight || document.body.clientHeight) && rect.left < (window.innerWidth || document.body.clientWidth);
		};

		/*
		 * Instanciates a given module
		 * 
		 * @param module string
		 * @param el object DomNode
		 * @param config object configuration object
		 * @return void
		 */
		priv.instanciate = function (module, el, config) {
			helperId = helperId + 1;
			var helper = 'helper' + (helperId),
				required = [];

			/*
			 * For each instance, we are dynamically constructing 
			 * a named helper module here, so we cann pass in a configuration 
			 * object into the module we want to instanciate. 
			 * There might be a simpler way to do this?
			 */
			define(
				helper, 
				[],
				{
					"module": module,
					"el": el,
					"config": config
				}
			);

			// put module and it's helper in an array
			required.push(module);
			required.push(helper);

			require(required, function (mod, helper) {
				try {
					// creat instance (by cloning the module)
					var uid = pub.instances.push($.extend(false, {}, mod));						
					uid = uid - 1;
					
					// set relating domnode
					pub.instances[uid].el = $(helper.el);

					// set module type
					pub.instances[uid].module = helper.module;

					// set instance id to domelement to allow backtracking  
					pub.instances[uid].el.attr('data-instance-id', uid);
					
					// set instance id (just for easier debugging, 
					// same as relating data-instance-id if you inspect el property)
					pub.instances[uid].instanceId = uid;

					// set relating config
					pub.instances[uid].config = helper.config;

					// if module has an init method, let's call it to kick it off
					if(pub.instances[uid].init !== undefined) {
						// execute the init function
						pub.instances[uid].init($(helper.el), helper.config);
					}

				} catch (e) {
					if (pub.debug) {
						console.log('module: ' + e.message);
					}
				}
			});
		};

		// domready, better be save than sorry
		$(function () {

			// start 
			pub.init();

			// expose global bagman (for debug), if configured to do so
			if (config.global === true) {
				pub.config = config;
				window.bagman = pub;
			}

		});

		return pub;
	}
);