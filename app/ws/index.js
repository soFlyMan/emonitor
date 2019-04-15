var WebSocketServer = require('ws').Server,
    webSocketServer = new WebSocketServer({ port: 8080 });
var HashMap = require('hashmap');

// record the client
var userConnectionMap = new HashMap();
var connectNum = 0;

// connection
webSocketServer.on('connection', function(ws) {
    ++connectNum;
    console.log('A client has connected. current connect num is : ' + connectNum);
    ws.on('message', function(message) {
        var objMessage = JSON.parse(message);
        var strType = objMessage['type'];
        console.log(message)
        switch (strType) {
            case 'online':
                userConnectionMap.set(objMessage['from'], ws);
                break;
            default:
                var targetConnection = userConnectionMap.get(objMessage['to']);
                if (targetConnection) {
                    targetConnection.send(message);
                }
        }
    });

    ws.on('close', function(message) {
        var objMessage = JSON.parse(message);
        userConnectionMap.remove(objMessage['from']);
    });
});