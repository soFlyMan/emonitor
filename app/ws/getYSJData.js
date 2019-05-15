const axios = require('axios')
var update_message = require('./emitter')
var logger = require('../util/logger')('云神价全部数据')
const { PEROID } = require('./config')
    //抓取数据间隔

var MAXID = 0
var NMAXID = 0

const url = `http://www.yunshenjia.com/newitems?maxId=${NMAXID}&dt=${Date.now()}`



module.exports = function getQNMData() {
    //第一次执行，获取maxid
    logger.info('获取<云神价>第一次maxid中...')
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
            logger.info('获取到<云神价>第一次maxid', NMAXID)
                // //更新及推送
            setInterval(async function() {
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
                        logger.info('持续获取<云神价>maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID)
                        if (l > 0) {
                            NMAXID = parseInt(response.data[l - 1].id)
                        }
                        if (NMAXID !== MAXID) {
                            //获取数据
                            logger.info('<云神价>maxid更新，推送商品信息...', 'maxid: ', response.data[l - 1].id, '获取数量:', l)
                                // MESSAGE_STRUCT.setMsg(response.data.items)
                                // logger.info(response.data.length)
                            update_message.emit('ysj_updated', response.data)

                            MAXID = NMAXID
                        }
                    })
                    .catch(error => {
                        logger.error(error)
                    })

            }, PEROID)

        })
        .catch(error => {
            logger.error(error)
        })

}