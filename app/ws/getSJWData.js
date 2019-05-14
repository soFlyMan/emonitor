const axios = require('axios')
var update_message = require('./emitter')

//抓取数据间隔
const PEROID = 12000

var MAXID = 0
var NMAXID = 3400209

const url = `http://www.joyj.com/real_list.php?s=0&last_real_id=686017&keyword=&search_min_price=&search_max_price=&top=&get_cat=0&u=0&sign=c06673a656831d8a635aef24b22d7698&t=1555667564570&callback=jQuery191043819316457478275_1555667463368&_=${Date.now()}`
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



module.exports = function getSJWData() {
    //第一次执行，获取maxid
    console.log('获取<神价屋>第一次maxid中...')
    axios({
        url: url,
        method: 'post',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "http://www.joyj.com/",
            "Referer": "http://www.joyj.com/"
        },
        data: `method=lessPrice&maxId=${NMAXID}`
    })
        .then(response => {
            console.log('获取到<神价屋>第一次maxid', response.data.maxid)
            NMAXID = response.data.maxid
            MAXID = response.data.maxid
            //更新及推送
            setInterval(async function () {
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
                        console.log('持续获取<神价屋>maxid中...', 'NMAXID:', NMAXID, 'MAXID:', MAXID, 'maxid', response.data.maxid)
                        NMAXID = response.data.maxid
                        if (NMAXID !== MAXID) {
                            //获取数据
                            console.log('<神价屋>maxid更新，推送商品信息...')
                            // MESSAGE_STRUCT.setMsg(response.data.items)
                            update_message.emit('updated', response.data.items)

                            MAXID = NMAXID
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })

            }, PEROID)

        })
        .catch(error => {
            console.log(error)
        })

}