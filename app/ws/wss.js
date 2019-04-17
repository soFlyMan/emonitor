// var WebSocketServer = require('ws').Server,
//     webSocketServer = new WebSocketServer({ port: 8080 });
// var HashMap = require('hashmap');

// // record the client
// var userConnectionMap = new HashMap();
var getYSJData = require('./API')
var update_message = require('./emitter')


// connection
module.exports = function(webSocketServer, userConnectionMap) {
    //获取同步消息
    getYSJData()
    var connectNum = 0;
    webSocketServer.on('connection', function(ws) {

        // function wssend(msg) {
        //     console.log('待推送商品信息:', msg)
        //     ws.send(JSON.stringify(msg))
        // }
        update_message.on('updated', (msg) => {
            ws.send(JSON.stringify(msg))
        })
        ws.send(JSON.stringify(global.GLOBAL_ITMES))
            // getYSJData(wssend)

        ++connectNum;
        console.log('A client has connected. current connect num is : ' + connectNum);
        ws.on('message', function(message) {
            var objMessage = JSON.parse(message);
            var strType = objMessage['type'];
            console.log(strType, objMessage.from, 'has sent a message')
            switch (strType) {
                case 'online':
                    userConnectionMap.set(objMessage['from'], ws);
                    break;
                default:
            }
            var targetConnection = userConnectionMap.get(objMessage['from']);
            if (targetConnection) {
                targetConnection.send(`${objMessage.from}, nice to meet you!`);
            }
        });

        ws.on('close', function(message) {
            var objMessage = JSON.parse(message);
            userConnectionMap.remove(objMessage['from']);
        });
    });
}