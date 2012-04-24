var sys = require("util"),
  http = require("http"),
  url = require("url"),
  util = require("util"),
  path = require("path"),
  clc = require('cli-color'),
  request = require('request'),
  cluster = require('cluster'),
  numCPUs = require('os').cpus().length * 4,
  fs = require("fs");
var port = parseFloat(process.argv[1]) || 9001;
var host = parseFloat(process.argv[2]) || 'http://ftp.wa.co.za/pub/ubuntuarchive';
if (cluster.isMaster) {
  // Fork workers.
  sys.log(clc.yellow('Listening on port ' + port));
  for (var i = 0; i < numCPUs; i++) {
    sys.log(clc.blue('forking worker #' + (i + 1)));
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log(clc.red('worker ' + worker.pid + ' died'));
  });
} else {
  http.createServer(function(req, res) {
    sys.log(clc.green('--req--> ' + req.url));
    request(host + req.url).pipe(res);
  }).listen(port);
}
