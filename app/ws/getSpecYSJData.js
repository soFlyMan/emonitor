const axios = require('axios')
const { PEROID } = require('./config')

//抓取数据间隔

var MAXID = 0
var NMAXID = 0

const url = `http://www.yunshenjia.com/newitems?maxId=${NMAXID}&dt=${Date.now()}`


module.exports = function getSpecYSJData(from, params, userConnectionMap, targetConnection){
    console.log(from, ': 获取<云神价>第一次maxid中...')
    axios({
        url: url,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "http://www.yunshenjia.com",
            "Referer": "http://www.yunshenjia.com/"
        },
        data: `sjMaxId=${NMAXID}&dt=${Date.now()}`
    })
        .then(response => {
            let len = response.data.length
            NMAXID = parseInt(response.data[len - 1].id)
            MAXID = NMAXID
            console.log(from, ': 获取到<云神价>第一次maxid', NMAXID)
            // //更新及推送
            userConnectionMap.set(`${from}_interval`, setInterval(async function () {
                var newUrl = `http://www.yunshenjia.com/newitems?maxId=${NMAXID}&dt=${Date.now()}`
                await axios({
                    url: newUrl,
                    method: 'post',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "Origin": "http://www.yunshenjia.com",
                        "Referer": "http://www.yunshenjia.com/"
                    },
                    data: `method=lessPrice&maxId=${NMAXID}`
                })
                    .then(response => {
                        let l = response.data.length
                        console.log(from, ': 持续获取<云神价>maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID)
                        if (l > 0) {
                            NMAXID = parseInt(response.data[l - 1].id)
                        }
                        if (NMAXID !== MAXID) {
                            //获取数据
                            console.log(from, ': <云神价>maxid更新，推送商品信息...', 'maxid: ', response.data[l - 1].id, '获取数量:', l)
                            // MESSAGE_STRUCT.setMsg(response.data.items)
                            // console.log(response.data.length)
                            // update_message.emit('ysj_updated', response.data, NMAXID)
                            targetConnection.send(JSON.stringify(response.data))

                            MAXID = NMAXID
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })

            }, PEROID)

            )
        })
        .catch(error => {
            console.log(error)
        })
}