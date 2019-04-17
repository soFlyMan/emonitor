var events = require('events')
var util = require('util')
var update_message = new events.EventEmitter()

update_message.on('removeListener', (event, listeners) => {
    console.log('remove:' + event)
})

// update_message.on('updated', (data, ws) => {
//     console.log(data, 'data', ws)
//     console.log('items updated')
// })

module.exports = update_message