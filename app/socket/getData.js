const fetch = require('node-fetch')

module.exports = function getInitData() {
    const url = 'http://www.912sc.cn/api.ashx?_t=1555248254372'
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/json,text/javascript,*/*;q=0.01',
            'Origin': 'http://www.912sc.cn',
            'Referer': 'http: //www.912sc.cn/'

        },
        body: {
            'method': 'lessPrice',
            'maxId': '3400209'
        }
    }).then(function(data) {
        console.log(data)
    }).catch(function(err) {
        console.log(err)
    })
}