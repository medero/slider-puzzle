var http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    path = require('path'),
    cache = {};

function send404( response ) {
    response.writeHead( 404, {"Content-Type": "text/plain" });
    response.write('Error 404: resource not found')
    response.end();
}

function sendFile( response, filePath, fileContents ) {
    response.writeHead(
        200, { "Content-Type": mime.lookup( path.basename(filePath) ) }
        );
    response.end(fileContents);
}

var mode = 'development';

function serveStatic( response, cache, absPath ) {

    console.log('absPath ' + absPath);

    if ( mode === 'production' && cache[absPath] ) {
        sendFile( response, absPath, cache[absPath] );
    } else {
        fs.exists( absPath, function( exists ) {
            if ( exists ) {
                fs.readFile( absPath, function( err, data ) {
                    if ( err ) {
                        send404( response );
                    } else {
                        cache[absPath] = data;
                        sendFile( response, absPath, data );
                    }
                });
            } else {
                send404( response );
            }});
    }
}

var backend = require('./app/backend');

var server = http.createServer(function( req, res ) {

    console.log('-------------------------------------------------- createServer hit-----------------------------------------------------');

    var filePath,
        chunks = req.url.split('/');

    // Homepage
    if ( req.url == '/' ) {

        filePath = 'public/index.html';

    // Create a room
    } else if ( chunks[1] == 'create-room' ) {

        var room = backend.createRoom();

        console.log('Redirecting');

        // This needs to be 302 since the browser caches 301s
        res.writeHead(302, {
            'Location': 'http://localhost:3000/room/' + room.id
        });
        res.end();

    } else if ( chunks[1] == 'room' ) {

        console.log('got here!');
        console.log('chunks[2] is ' + chunks[2] );

        if ( chunks.length > 1 && !backend.findRoom( chunks[2] ) ) {

            filePath = 'public/404.html';

        } else {

            // Create the room
            filePath = 'public/room.html';
        }

    } else {

        filePath = 'public' + req.url;
    }

    console.log( 'filePath is ' + filePath );
    if ( filePath )
        serveStatic( res, cache, filePath );

});

server.listen( 3000, function() {
    console.log('Running server on port 3000')
});

backend.listen( server );
