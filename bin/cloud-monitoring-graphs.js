var GraphServer = require('../lib/app').GraphServer;


var app = new GraphServer();

app.listen(3000);
console.log('Graph Server now running on port ' + app.port);
