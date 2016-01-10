var socketio = require('socket.io')
    , io
    , rooms = []
    , nickNames = {};

/*
 * Generate the puzzle array
 */
function generatePuzzleArray() {
    var array = [1,2,3,4,5,6,7,8];
    array = shuffle( array );
    return array;
}

var puzzle = generatePuzzleArray();

function _findRoom( id ) {

    var found = false;

    rooms.forEach(function(room) {
        if ( room.id == id ) {
            found = room;
        }
    });

    return found;
};

exports.listen = function( server ) {

    io = socketio.listen( server );

    io.sockets.on('connection', function( socket ) {

        var currentRoom;

        socket.on('registerUser', function( room ) {
            var tempRoom = _findRoom(room.id);

            if ( tempRoom ) {
                tempRoom.users.push( socket.id );
            }

            socket.emit('registeredUser');
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

function _createRoom() {

    var id = makeRoomId();
    
    var room = {
        id: id,
        url: '/room/' + id,
        users: []
    }

    rooms.push( room );

    return room;
};

exports.findRoom = _findRoom;
exports.createRoom = _createRoom;

function makeRoomId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/*
 * Shuffle the elements of an array randomly
 */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

