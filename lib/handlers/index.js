var handlers = [
  'main'
];


handlers.forEach(function(handler) {
  exports[handler] = require('./' + handler);
});
