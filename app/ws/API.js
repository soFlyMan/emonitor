const axios = require('axios')
var update_message = require('./emitter')

var MAXID = 0
var NMAXID = 3400209

const url = `http://www.912sc.cn/api.ashx?_t=${Date.now()}`

module.exports = function getYSJData() {
    //第一次执行，获取maxid
    console.log('获取第一次maxid中...')
    axios({
            url: url,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Origin": "http://www.912sc.cn",
                "Referer": "http://www.912sc.cn/"
            },
            data: `method=lessPrice&maxId=${NMAXID}`
        })
        .then(response => {
            console.log('获取到第一次maxid')
            NMAXID = response.data.maxid
            MAXID = response.data.maxid
                //更新及推送
            setInterval(async function() {
                await axios({
                        url: url,
                        method: 'post',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                            "Accept": "application/json, text/javascript, */*; q=0.01",
                            "Origin": "http://www.912sc.cn",
                            "Referer": "http://www.912sc.cn/"
                        },
                        data: `method=lessPrice&maxId=${NMAXID}`
                    })
                    .then(response => {
                        console.log('持续获取maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID, 'maxid', response.data.maxid)
                        NMAXID = response.data.maxid
                        if (NMAXID !== MAXID) {
                            //获取数据
                            console.log('maxid更新，推送商品信息...')
                                // MESSAGE_STRUCT.setMsg(response.data.items)
                            update_message.emit('updated', response.data.items)

                            MAXID = NMAXID
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })

            }, 12000)

        })
        .catch(error => {
            console.log(error)
        })

}