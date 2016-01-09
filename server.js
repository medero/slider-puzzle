var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

/*
var server = http.createServer(function( request, response ) {
    response.writeHead(200, {'Content-Type': 'text/html' });
    response.end();
});
*/

http.listen( 3000, function() {
    console.log('Running server on port 3000')
});
