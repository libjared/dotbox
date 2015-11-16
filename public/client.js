var socket = io();

var boxSize = new Size(32, 32);
var boardSize = new Size(10, 10);

var drawStart = boxSize.clone();

var teamA = '#226666';
var teamAhalf = '#003333';
var teamB = '#aa6c39';
var teamBhalf = '#552700';
var dots = '#555555';

var myTeam = 'a';
var myTurn = true;

var toWorld = function(x,y) {
    return new Point(x * boxSize.width + drawStart.width, y * boxSize.height + drawStart.height);
}

var drawPoints = function() {
    for (var y = 0; y < boardSize.height; y++) {
        for (var x = 0; x < boardSize.width; x++) {
            new Path.Circle({
                center: toWorld(x,y),
                radius: 5,
                fillColor: dots,
            });
        }
    }
}

var linesH = [];
var linesV = [];

var lineEnter = function(e) {
    if (this.team == null) {
        this.fillColor = teamAhalf;
    }
}
var lineLeave = function(e) {
    if (this.team == null) {
        this.fillColor = 'black';
    }
}

var lineClick = function(e) {
    if (this.team == null) {
        this.fillColor = myTeam == 'a' ? teamA: teamB;
        this.team = myTeam;
        socket.emit('place', {
            orient: this.orient,
            boardx: this.boardx,
            boardy: this.boardy
        });
        myTurn = false;
    }
}

var make = function(v0, v1) {
    var line = new Path.Rectangle({
        from: v0,
        to: v1,
        fillColor: 'black',
    });
    line.onMouseEnter = lineEnter;
    line.onMouseLeave = lineLeave;
    line.onClick = lineClick;
    line.team = null;
    return line;
}

var makeH = function(x,y) {
    var v0 = toWorld(x, y) + [ 0, -3 ];
    var v1 = toWorld(x+1, y) + [ 0, 3 ];
    var line = make(v0, v1);
    line.orient = 'h';
    line.boardx = x;
    line.boardy = y;
    linesH[y][x] = line;
}

var makeV = function(x,y) {
    var v0 = toWorld(x, y) + [ -3, 0 ];
    var v1 = toWorld(x, y+1) + [ 3, 0 ];
    var line = make(v0, v1);
    line.orient = 'v';
    line.boardx = x;
    line.boardy = y;
    linesV[y][x] = line;
}

var initLines = function() {
    for (var y = 0; y < boardSize.height; y++) {
        linesH[y] = [];
        if (y < boardSize.height - 1) linesV[y] = [];
        for (var x = 0; x < boardSize.width; x++) {
            if (x < boardSize.width - 1) makeH(x, y);
            if (y < boardSize.height - 1) makeV(x, y);
        }
    }
}

initLines();
drawPoints();
