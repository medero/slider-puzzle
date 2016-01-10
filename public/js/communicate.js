
var sliderPuzzle = (function() {

    function getRoomId() {
        var substring = 'room/';
        var index = location.href.indexOf(substring);
        return location.href.slice(index+substring.length, location.href.length);
    }

    var socket = io.connect();

    var roomSection = window.section && section == 'room';

    // Create room if none exists
    if ( roomSection ) {
        socket.emit('registerUser', {
            id: getRoomId()
        });
    } else {
        socket.emit('requestRooms')
    }

    socket.on('connect', function() {
        console.log('yay');
    });

    socket.on('registeredUser', function() {
        socket.emit('requestRooms')
        //socket.emit('startGame')
    });

    socket.on('receiveRooms', function(rooms) {
        if ( rooms.length ) {
            $.each( rooms, function( i, room ) {
                var $a = $('<a/>').attr('href', room.url).text(room.url),
                    $li = $('<li/>').append( $a )

                $li.appendTo('#rooms')
            });
        }
    });

    return {
    }

})(window,document);
