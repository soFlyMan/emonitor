const axios = require('axios')
const { PEROID } = require('./config')
var logger = require('../util/logger')('筛选云神价数据')
var formatYSJItems = require('./formatItems').formatYSJItems

//抓取数据间隔

var MAXID = 0
var NMAXID = 0

const url = `http://www.yunshenjia.com/newitems?maxId=${NMAXID}&dt=${Date.now()}`


module.exports = function getSpecYSJData(from, params, userConnectionMap, targetConnection) {
    logger.info(params)
    if (params.status == 0) {
        // 不取
        return
    }
    let cookieObj = Object.assign({}, {
        discount: params.discount || '',
        dsIds: params.dsIds || '',
        catIds: params.catIds || '',
    })
    logger.debug(cookieObj)
    let cookie = 'UM_distinctid=168278017313ce-094a819237f108-10306653-13c680-16827801732523; JSESSIONID=F39DB5E6173668E6874D98449B0C3253; __session:0.24652409294176292:=http:; CNZZDATA1257173424=1807162650-1546847779-%7C1557895788; Hm_lvt_f0212b5eba144faf4ef1bbf76392d0dd=1555648467,1555648951,1555650028,1557898873; Hm_lpvt_f0212b5eba144faf4ef1bbf76392d0dd=1557898873; remind=false; '
    Object.keys(cookieObj).map(obj => {
        if (cookieObj[obj] !== '') {
            cookie = cookie + `${obj}=${cookieObj[obj]}`
        }
    })

    logger.info(from, 'cookie: ', cookie)
    logger.info(from, ': 获取<云神价>第一次maxid中...')
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
            logger.info(from, ': 获取到<云神价>第一次maxid', NMAXID)
                // //更新及推送
            userConnectionMap.set(`${from}_ysj_interval`, setInterval(async function() {
                    var newUrl = `http://www.yunshenjia.com/newitems?maxId=${NMAXID}&dt=${Date.now()}`
                    await axios({
                            url: newUrl,
                            method: 'post',
                            withCredentials: true,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                                "Accept": "application/json, text/javascript, */*; q=0.01",
                                "Origin": "http://www.yunshenjia.com",
                                "Referer": "http://www.yunshenjia.com/",
                                "Cookie": cookie
                            },
                            data: `method=lessPrice&maxId=${NMAXID}`
                        })
                        .then(response => {
                            let l = response.data.length
                            logger.info(from, ': 持续获取<云神价>maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID)
                            if (l > 0) {
                                NMAXID = parseInt(response.data[l - 1].id)
                            }
                            if (NMAXID !== MAXID) {
                                //获取数据
                                logger.info(from, ': <云神价>maxid更新，推送商品信息...', 'maxid: ', response.data[l - 1].id, '获取数量:', l)
                                    // MESSAGE_STRUCT.setMsg(response.data.items)
                                    // logger.info(response.data.length)
                                    // update_message.emit('ysj_updated', response.data, NMAXID)
                                targetConnection.send(JSON.stringify(formatYSJItems(response.data)))

                                MAXID = NMAXID
                            }
                        })
                        .catch(error => {
                            logger.error(from, error)
                        })

                }, PEROID)

            )
        })
        .catch(error => {
            logger.error(from, error)
        })
}