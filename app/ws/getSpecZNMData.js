const axios = require('axios')
var logger = require('../util/logger')('筛选在哪买数据')
const {
    PEROID
} = require('./config')
    //抓取数据间隔


var MAXID = 0
var NMAXID = 3400209

const url = `http://zainamai.cn/api.ashx?_t=${Date.now()}`
    // var items = [{
    //     Id: 3490819,
    //     Minprice: "185",
    //     Oldprice: "245",
    //     SiteId: 7,
    //     SiteName: "网易考拉",
    //     SpImg: "https://haitao.nos.netease.com/7a9b93f1511b4ce7bdb06b13db11b82e1544671600295jpm1l6s211960.jpg?imageView&#38;thumbnail=262x262&#38;quality=90",
    //     SpName: "【祛黄美颜好气色】Salus 莎露斯 Floradix 德国铁元 补铁养血营养液红色版500毫升 2瓶",
    //     SpUrl: "/UrlRedirect.aspx?proid=3490819",
    //     Spprice: "185",
    //     Youhui: "",
    //     Zhekou: "7.6",
    //     Ziying: "自营",
    //     Zkcss: "8",
    //     time: "19:39"
    // }]



module.exports = function getSpecZNMData(from, params, userConnectionMap, targetConnection) {
    logger.info(params)
    if (params.status == 0) {
        // 不取
        return
    }
    //第一次执行，获取maxid
    logger.info(from, '获取<在哪买>第一次maxid中...')
    axios({
            url: url,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Origin": "http://zainamai.cn",
                "Referer": "http://zainamai.cn/"
            },
            data: `method=lessPrice&maxId=${NMAXID}`
        })
        .then(response => {
            logger.info(from, '获取到<在哪买>第一次maxid', response.data.maxid)
            NMAXID = response.data.maxid
            MAXID = response.data.maxid
                //更新及推送

            userConnectionMap.set(`${from}_znm_interval`, setInterval(async function() {
                await axios({
                        url: url,
                        method: 'post',
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                            "Accept": "application/json, text/javascript, */*; q=0.01",
                            "Origin": "http://zainamai.cn",
                            "Referer": "http://zainamai.cn/"
                        },
                        data: `method=lessPrice&maxId=${NMAXID}`
                    })
                    .then(response => {
                        logger.info(from, '持续获取<在哪买>maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID, 'maxid', response.data.maxid)
                        NMAXID = response.data.maxid
                        if (NMAXID !== MAXID) {
                            //获取数据
                            logger.info(from, '<在哪买>maxid更新，推送商品信息...', '获取数量: ', response.data.items.length)
                                // MESSAGE_STRUCT.setMsg(response.data.items)
                                // update_message.emit('znm_updated', response.data.items)
                            targetConnection.send(JSON.stringify(response.data.items))

                            MAXID = NMAXID
                        }
                    })
                    .catch(error => {
                        logger.error(from, error)
                    })

            }, PEROID))
        })
        .catch(error => {
            logger.error(from, error)
        })

}