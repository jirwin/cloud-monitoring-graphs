var async = require('async');


/**
 * Returns the index page.
 */
exports.index = function(req, res) {
  res.send('cloud monitoring graphing server');
};


exports.graph = function(req, res) {
  res.send('graph!');
};
