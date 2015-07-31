/*!
 * booklet.js. A simple module initializer by creating view models.
 *
 * Copyright (c) 2015 Barış Güler
 * http://hwclass.in
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 *
 * Launch  : July 2015
 * Version : 1.0.0
 * Released: July 27th, 2015
 *
 *
 * Manages the view states and other functionalities in page instances.
 * Every page instance is generated from a Booklet instance.
 * Page instances are related with a view and binds model data and functionalities.
 * When the init method of a Page instance is invoked, it means that you are about to init related module.  
 */

/**
* Booklet : The main application wrapper object
* @param <String> name
* @param <Object> options
*/
var Booklet = function (name, options) {
	
	this.name = name;

	this.defaults = (typeof options !== 'undefined' ? options : {});

	var SERVICES = [];

	var booklet = this;

	/**
	* Page : The View-Model object to bind values and events
	* @noparam
	*/
	var Page = function () {
		
		var self = this;

		this.booklet = booklet;

		var MODULES = [],
				TOPPICS = [];

		/**
		* register() is a registering method to add modules into the view model
		*
		* @param {String} moduleName
		* @param {Function} context
		*/
		this.register = function (moduleName, context) {
			MODULES.push({name : moduleName, fn : context, started : false});
		};

		/**
		* detach() is a destroying the connection any module with the main booklet object
		*
		* @param {String} moduleName
		*/
		this.detach = function (moduleName) {
			var selectedModuleToDetach = self.getModule(moduleName, true);
			try {
				MODULES.splice(selectedModuleToDetach.index, 1);
			} catch (err) {
				console.log(err);
			};
		};

		/**
		* start() is starting point to make any module begin to work
		*
		* @param {String} moduleName
		*/
		this.start = function (moduleName) {
			var selectedModuleToStart = self.getModule(moduleName);
			if (!!selectedModuleToStart.fn) {
				selectedModuleToStart.fn.init();
				selectedModuleToStart.started = true;
			}
		};

		/**
		* startAll() is a starting point for all modules to make them all began to work
		*
		* @param {String} topic
		* @param {Object} info
		*/
		this.startAll = function () {
			for (var modulesCounter = 0, len = MODULES.length; modulesCounter < len; modulesCounter++) {
				if (!MODULES[modulesCounter].started) {
					self.start(MODULES[modulesCounter].name);
				} else {
				}
			}
		};

		/**
		* stop() is a method to stop a module working
		*
		* @param {moduleName} moduleName
		*/
		this.stop = function (moduleName) {
			var selectedModuleToStop = self.getModule(moduleName);
			selectedModuleToStop = null;
		};

		/**
		* subscribe() is a subscribing method to listen publishing events
		*
		* @param {String} topic
		* @param {Function} listener
		*/
		this.subscribe = function (topic, listener) {
		  if(!TOPICS[topic]) TOPICS[topic] = { queue: [] };
		  var index = TOPICS[topic].queue.push(listener);
		  return (function(index) {
		    return {
		      remove: function() {
		        delete TOPICS[index];
		      }
		    }
		  })(index);
		};

		/**
		* publish() is a sending data method to subscriptions listening publishing events
		*
		* @param {String} topic
		* @param {Object} info
		*/
		this.publish = function (topic, info) {
		  if(!TOPICS[topic] || !TOPICS[topic].queue.length) return;
		  var items = TOPICS[topic].queue;
		  for(var x = 0; x < items.length; x++) {
		    items[x](info || {});
		  }
		};

		/**
		* getModule() is a getter method to get modules with a module name and its index
		*
		* @param {String} topic
		* @param {Object} info
		*/
		this.getModule = function (moduleName, withIndex) {
			var selectedModule,
					indexOfTheModule,
					builtModuleObj;
			for (var modulesCounter = 0, len = MODULES.length; modulesCounter < len; modulesCounter++) {
				if (MODULES[modulesCounter]['name'] === moduleName) {
					selectedModule = MODULES[modulesCounter];
					indexOfTheModule = modulesCounter;
				}
			};
			if (withIndex) {
				selectedModule = builtModuleObj = {
					selectedModule : selectedModule,
					index : indexOfTheModule
				} 
			}
			return selectedModule;
		};

		/**
		* getService() is a getter method to fetch the specified service with a service name
		*
		* @param {String} topic
		* @param {Object} info
		*/
		this.getService = function (serviceName) {
			var selectedService;
			for (var servicesCounter = 0, len = SERVICES.length; servicesCounter < len; servicesCounter++) {
				if (SERVICES[servicesCounter]['name'] === serviceName) {
					selectedService = SERVICES[servicesCounter];
				}
			};
			return selectedService;
		};

		/**
		* getConfig() is a method to get the current configuration properties and etc.
		*
		* @noparam
		*/
		this.getConfig = function () {
			return booklet.config;
		};

		/**
		* getUtility() is a method to get the utility methods set into current context
		*
		* @param {String} topic
		* @param {Object} info
		*/
		this.getUtility = function () {
			return booklet.utility;
		};

	};

	/**
	* createView() is a creator method for new views
	*
	* @param {String} topic
	* @param {Object} info
	*/
	this.createView = function (options) {
		self.defaults = (typeof options !== 'undefined' ? options : {});
		return new Page();
	};

	/**
	* createService() is a creator method for new services
	*
	* @param {String} serviceName
	* @param {Object} context
	*/
	this.createService = function (serviceName, context) {
		SERVICES.push({name : serviceName, fn : context});
	};

};
