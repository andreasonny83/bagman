/*
 * bagman.js
 * 
 * Find out which modules are on the page and lazy load and 
 * evaluate your modular Javascript (AMD) accordingly. Handy for
 * multi-page projects. Supports lazyloading of modules not in viewport
 * at the time of page initialization which can speed up loading time,
 * especialy on mobile devices with small screens and slow processors.
 * Works with almond, but makes most sense with a loader that can perform
 * lazyloading such as require.js, 
 *
 * @author matthias@theotherpeople.de (@mhrisse)
 * @license: MIT
 * @version 0.2.0
 *
 * Next Version:
 * @TODO move config outside
 * @TODO remove debug
 * @TODO define API to let module instances communicate
 * @TODO define API to update/dispose (pjax)
 */

define(
	'bagman',
	['jquery'],
	function ($) {
		"use strict";

		var container = 'body',
			selector = '*[data-module]',
			$module = $(container).find(selector),
			inViewport = [],
			notInViewport = [],
			modules = [],
			loaded = 0,
			priv = {},
			pub = {},
			helperId = 0;

		// public API
		pub.onloadDone = false;
		pub.debug = false;

		pub.init = function () {
			// Mark modules which are inViewport
			$.each($module, function (index, value) {
				if (priv.elementInViewport(value)) {
					inViewport.push(value);
					value.inViewport = true;
					priv.instanciate($(value).data('module'), value, $(value).data('config'));
				} else {
					notInViewport.push(value);
					value.inViewport = false;
				}
			});

			// Delay init of module not in viewport until onload has fired
            $(window).load(function () {
				if (pub.debug) {
					console.log('* onLoad ..');
				}

				pub.onloadDone = true;

				$.each(notInViewport, function (index, value) {
					priv.instanciate($(value).data('module'), value, $(value).data('config'));
				});
            });
		};

		// private 
		// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		priv.elementInViewport = function (el) {
			var rect = el.getBoundingClientRect();
			return rect.top < (window.innerHeight || document.body.clientHeight) && rect.left < (window.innerWidth || document.body.clientWidth);
		};

		priv.instanciate = function (module, el, config) {
			helperId = helperId + 1;
			var helper = 'helper' + (helperId),
				required = [];

			define(helper, [],
				{
					"module": module,
					"el": el,
					"config": config
				}
				);

			// console.log(helper);
			required.push(module);
			required.push(helper);

			require(required, function (mod, helper) {
				var m = {};
				try {
					// intianitiate module and call it's init method, handing over the domnode
					m = new mod.init($(helper.el), helper.config);

					if (pub.debug) {
						if (helper.el.inViewport === true) {
							$(helper.el).css('border', '1px solid green');
							console.log('init ..');
							console.log($(helper.el));
						} else {
							$(helper.el).css('border', '1px solid orange');
						}
					}

					// console.dir(m);
				} catch (e) {
					if (pub.debug) {
						console.log('module: :' + e.message);
					}
				}
			});
		};

		$(function () {
			pub.init();
		});

		return pub;
	}
);