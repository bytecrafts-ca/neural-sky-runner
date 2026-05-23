var http = require('http');
var fs = require('fs');
var path = require('path');
var PORT = process.env.PORT || 3000;
var mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
http.createServer(function (req, res) {
  var fp = '.' + (req.url === '/' ? '/index.html' : req.url.split('?')[0]);
  fs.readFile(fp, function (err, data) {
    if (err) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, function () { console.log('http://localhost:' + PORT); });
