var socketio = require('socket.io')
    , io
    , rooms = []
    , nickNames = {}
    , puzzle = require('./puzzle')
    , helpers = require('./helpers');

function _findRoom( id ) {

    var found = false;

    rooms.forEach(function(room) {
        if ( room.id == id ) {
            found = room;
        }
    });

    return found;
};

function generateRoomId() {
    return helpers.generateHash(5);
}

function _createRoom() {

    var id = generateRoomId();
    
    var room = {
        id: id,
        url: '/room/' + id,
        users: []
    }

    rooms.push( room );

    return room;
};

exports.listen = function( server ) {

    io = socketio.listen( server );

    io.sockets.on('connection', function( socket ) {

        var currentRoom;

        socket.on('registerUser', function( room ) {
            var tempRoom = _findRoom(room.id);

            if ( tempRoom ) {
                tempRoom.users.push( socket.id );
                socket.emit('registeredUser');
            }

        });

        socket.on('joinRoom', function( room ) {
            console.log('joinRoom invoked and room.id is ' + room.id);
        });

        // Return the rooms available
        socket.on('requestRooms', function() {
            socket.emit('receiveRooms', rooms );
        });

        socket.on('createRoom', _createRoom);

        socket.on('disconnect', function() {
            var id = socket.id;
            delete nickNames[id];
            for ( var i = 0; i<rooms.length; i++ ) {
                if ( rooms[i].users.length ) {
                    var index = rooms[i].users.indexOf( id );
                    if ( index !== -1 ) {
                        rooms[i].users.splice( index, 1 );
                    }
                }
            }
        });

    });
};

exports.findRoom = _findRoom;
exports.createRoom = _createRoom;
