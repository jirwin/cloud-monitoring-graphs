var async = require('async');
var request = require('request');
var sprintf = require('sprintf').sprintf;

var config = require('../../config');


/**
 * Returns the index page.
 */
exports.index = function(req, res) {
  res.send('graph server');
};

var token, expires;

/**
 * Returns graph data.
 */
exports.graph = function(req, res) {
  var entity = req.params.entity,
      check = req.params.check,
      metric = req.params.metric
      to = Date.now(),
      from = to - 60 * 60 * 12 * 1000;

  async.auto({
    auth: function getIdent(callback) {
      var payload = {
             "auth":{
               "RAX-KSKEY:apiKeyCredentials":{
                  "username": config.monitoring_user,
                  "apiKey": config.monitoring_key
               }
            }
          },
          options = {
            uri: config.auth_url,
            body: payload,
            json: true
          },
          now = Date.now();
          fiveMinutes = 60 * 5 * 1000;

      if (token && expires && now < expires - fiveMinutes) {
        callback();
        return;
      }

      request.post(options, function(err, resp, body) {
        token = body.access.token.id;
        expires = new Date(body.access.token.expires).getTime();
        callback();
      });
    },

    points: ['auth', function getPoints(callback, results) {
      var options = {
            uri: sprintf("%s/entities/%s/checks/%s/metrics/%s/plot",
                         config.api_url, entity, check, metric),
            headers: {
              'X-Auth-Token': token
            },
            qs: {
              from: from,
              to: to,
              points: 50,
            },
            json: true
          };

      request(options, function(err, resp, body) {
        callback(null, body.values);
      });
    }],

    format: ['points', function(callback, results) {
      var points = results.points,
          formattedPoints;

      formattedPoints = points.map(function(point) {
        var newPoint = {};

        newPoint.date = point.timestamp;
        newPoint.value = point.average;

        return newPoint;
      });


      callback(null, formattedPoints);
    }]
  }, function(err, results) {
    res.send(results.format);
  });
};
