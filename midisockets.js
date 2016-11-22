var midi = require('midi');
var http = require('http');
var WebSocketServer = require('websocket').server;

var input = new midi.input();
var connections = [];
input.getPortCount();
input.getPortName(0);

// Configure a callback.
input.on('message', function(deltaTime, message) {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
   // console.log('m:' + message + ' d:' + deltaTime);
    if (message.length === 1) { return; }
    for (var c in connections) {
        connections[c].sendUTF(JSON.stringify({ data: message }));
    }
});

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', function(request) {
    var cnct = request.accept();
    connections.push( cnct );
    console.log((new Date()) + ' Connection accepted.');
    cnct.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer disconnected.');
    });

    cnct.on('message', function(msg) {});
});


// Open the first available input port.
input.openPort(0);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

// Close the port when done.
//input.closePort();

function onExit() {
    console.log('Exit MIDISocket WebSocket Server');
    input.closePort();
}

//do something when app is closing
process.on('exit', onExit);

//catches ctrl+c event
process.on('SIGINT', onExit);

//catches uncaught exceptions
process.on('uncaughtException', onExit);