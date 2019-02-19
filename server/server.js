var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var games = [];

app.get('/', function(req, res){
    res.sendfile('../public/index.html');
});

app.get('*', function(req, res){
    res.sendfile(../public/ + req.url.substr(1));
});

io.on('connection', function(socket){
    console.log('User connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('disconnectPlayer', socket.id);
    });

    // tento typ spravy je automaticky preposielany medzi klientami a hostom v ramci jednej hry/izby!!!
    //
    // {
    //      type:
    //      recipient: 'all', 'host', 'others', #socketid'
    // }
    //
    socket.on('message', function(data){
        io.emit('message', data);
    });


    // data = {
    //     playerName: string
    //     gameName: string
    // }
    socket.on('createGame', function(data) {
        var game
        ;

        // vytvori sa objekt s info o hre
        game = {
            name: data.gameName,
            playersCount: 1,
            id: socket.id,
            hostSocket: socket,
            dateStart : new Date()
        };
        games.push(game);

        // host sa zaradi do room
        socket.join(game.id);

        // info hostovi, ze je to ok, moze spustit fyziku a veci s tym suviciace
        socket.emit('gameCreated', {
            gameId: socket.id
        });

        console.log('Game created: ' + game.name);
    });


    // data = {
    //      playerName: string
    //      gameId: string
    // }
    socket.on('joinGame',function(data){
        var room = getRoom()
        ;

        // skontroluje sa existencia miestnosti
        if (room) {
            // klient sa prihlasi na odber sprav, prida sa do room
            socket.join(room.id);

            room.socket.emit('joinGame',{
                playerName : data.playerName,
                playerId: socketId
            });
        }




        // hostovi sa da vediet, ze je novy hrac.
    });


});

function getRoom(roomId) {
    var thatRoom = null
    ;

    rooms.forEach( function(room, index) {
        if (room.id === roomId) {
            thatRoom = room;
        }
    });

    return thatRoom;
}


http.listen(3333, function(){
  console.log('listening on *:3333');
});


