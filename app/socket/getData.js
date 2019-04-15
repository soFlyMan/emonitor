const fetch = require('node-fetch')

function getInitData() {
    const url = 'http://www.912sc.cn/api.ashx?_t=1555248254372'
    fetch(url, {

    }).then(function(data) {
        console.log(data)
    })
}