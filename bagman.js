/*
 * Bagman
 * 
 * Lazy load and evaluate your modular Javascript (AMD) 
 * on multi-page websites.
 *
 * copyright (c) 2012 by Matthias H. Risse
 * 
 * The MIT License (MIT)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jslint nomen: true, browser: true */
/*global define, require, jQuery, $, _ */
define(
	'bagman',
	['jquery', 'underscore'],
	function ($, _) {
		"use strict";

		var selector = '*[data-module]',
			$module = $(selector),
			onPage = [],
			i = 0,
			used = [],
			modules = [],
			loaded = 0,
			initReady = false,
			pub = {};

		// Create array of modules on page
		for (i = 0; i < $module.length; i = i + 1) {
			if ($($module[i]).data('module') !== '') {
				onPage.push($($module[i]).data('module'));
			}
		}

		// Boil down mutiple occurences to modules used
		used = _.unique(onPage);

		// Polyfil IE8-
		if (!Object.create) {
		    Object.create = function (o) {
		        if (arguments.length > 1) {
		            throw new Error('Object.create implementation only accepts the first parameter.');
		        }
		        function F() {}
		        F.prototype = o;
		        return new F();
		    };
		}


		// @todo feature
		// only initialize module if in viewport,
		// otherwise put on heap and re-evaluate when scrolling
		//
		// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		//
		// function elementInViewport(el) {
		//   var rect = el.getBoundingClientRect()
		//   return rect.top < (window.innerHeight || document.body.clientHeight) && rect.left < (window.innerWidth || document.body.clientWidth);
		// }
		// // and then you can use it:
		// alert(elementInViewport(document.getElementById('inner')));
		// // or
		// alert(elementInViewport($('#inner')[0]));​


		/*
		 * Kick-off loading of modules by issuing a require call to the
		 * AMD loader.
		 */
		require(used,
			function () {
				var args = arguments;

				$(function () {
					/*
					 * When all modules mentioned in array used are loaded,
					 * this callback will initialize each instance of a module on the page.
					 */
					$module.each(function (i, el) {
						if ($(this)) {
						// console.log('ele:' + i);
							var node = $(this),
								id = node.data('module'),
								config = node.data('config'),
								index = i,
								m = {};
							index = _.indexOf(used, onPage[i]);

							// initialize module for each appearance on page 
							try {
								m = Object.create(args[index].init(node, config));
							} catch (e) {
								// console.log('mhh..' + id);
								// console.log(e);
							}
							m.id = _.uniqueId();
							m.module = onPage[i];
							modules.push(m);
							loaded = loaded + 1;
						}
					});

					// flag if all modules on page loaded
					if (loaded === onPage.length) {
						initReady = true;
					}
				});
			});

		// the public interface

		pub.init = function () {
			return this;
		};

		// Rescans part of the page (for example after a PJAX request has successfully loaded)
		// and initializes the modules found. 
		pub.update = function ($domNode) {
			// console.log('updating modules..');
			return this;
		};

		pub.getModules = function (callback) {
			return modules;
		};


		pub.onComplete = function (callback) {
			//
		};

		return pub;
	}
);