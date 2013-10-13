var handlers = require('./handlers');


/**
 * Map of the routes to respond to.
 */
var RouteMap = {
  '/': {
    get: handlers.main.index
  },

  '/graph/:entity/:check/:metric': {
    get: handlers.main.graph
  }
};


exports.RouteMap = RouteMap;
