var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));
app.use('/paper', express.static(__dirname + '/node_modules/paper/dist/'));

var server = http.listen(8000, function () {
    var port = server.address().port;
    console.log('Example app listening on port %s', port);
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('place', function(data) {
        console.log('place at %s,%s,%s', data.orient, data.boardx, data.boardy);
    });
});