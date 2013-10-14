var http = require('http');
var express = require('express');
var _ = require('underscore');

var routes = require('./urls').RouteMap;
var config = require('../config');



/**
 * GraphServer webapp.
 * @constructor
 */
function GraphServer() {
  this.app = express();
  this.listening = false;
  this.configureMiddleware();
  this.mapRoutes(routes);
}




/**
 * Configure the express middlewares
 */
GraphServer.prototype.configureMiddleware = function() {
  this.app.use(express.logger());
  this.app.use(express.compress());
  this.app.use(express.static(__dirname + '/../static'));
};


/**
 * Start listening on a port.
 * @param {Number} port The port to listen on.
 */
GraphServer.prototype.listen = function(port) {
  port = port || config.port;

  if (!this.listening) {
    this.port = port;
    this.app.listen(5000);
    this.listening = true;
  }
};


/**
 * Add a route.
 * @param {String} method The HTTP verb to attach a route to.
 * @param {String} path The path to route to.
 * @param {Function} handler The function called when the route is hit.
 */
GraphServer.prototype.addRoute = function(method, path, handler) {
  this.app[method.toLowerCase()](path, handler);
};


/**
 * Given an object containing routes, map them all.
 * The routes object looks something like:
 *    {
 *      '/hello': {
 *        get: helloGetFunction,
 *        post: helloPostFunction
 *      },
 *
 *      '/monkey': {
 *        get: getAMonkey,
 *      }
 *    }
 * @param {Object} routes An object representing routes.
 */
GraphServer.prototype.mapRoutes = function(routes) {
  var self = this;

  _.each(routes, function(handlers, route) {
    _.each(handlers, function(handler, method) {
      method = method.toLowerCase();
      self.app[method](route, handler);
    });
  });
};


/** Base webapp export */
exports.GraphServer = GraphServer;
