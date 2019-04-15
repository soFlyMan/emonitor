module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('shituoge lianje le')
        var data = {
            items: [{ a: 1 }, { a: 2 }]
        }
        socket.on('privateMessage', function(msg) {
            console.log(msg.name, 'connected')
            if (msg.isVIP) {
                socket.emit('data', data)
            } else {
                socket.emit('data', 'no quanxian')
            }
        })
    })
}