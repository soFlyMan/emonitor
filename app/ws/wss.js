// var WebSocketServer = require('ws').Server,
//     webSocketServer = new WebSocketServer({ port: 8080 })
// var HashMap = require('hashmap')

// // record the client
// var userConnectionMap = new HashMap()
var logger = require('../util/logger')('链接')
var getZNMData = require('./getZNMData')
var getYSJData = require('./getYSJData')
var getSJWData = require('./getSJWData')
var update_message = require('./emitter')

var formatYSJItems = require('./formatItems').formatYSJItems
var formatZNMItems = require('./formatItems').formatZNMItems

var getSpecYSJData = require('./getSpecYSJData')
var clearAllInterval = require('./clearAllInterval')
    // const request = require('request')
    // const util = require('util')
    // const getChuckNorrisFact = util.promisify(request)


// connection
module.exports = function(webSocketServer, userConnectionMap) {
    //获取同步消息
    getZNMData()
    getYSJData()
        // getSJWData()

    var connectNum = 0
    webSocketServer.on('connection', function(ws) {
        ++connectNum
        logger.info('A client has connected. current connect num is : ' + connectNum)
        ws.on('message', function(message) {
            var objMessage = JSON.parse(message)
            var strType = objMessage['type']
            logger.info(strType, objMessage.from, 'has sent a message')
                //在线状态
            switch (strType) {
                case 'online':
                    userConnectionMap.set(objMessage['from'], ws)
                        //标识此链接实例
                    this.objMessage = objMessage
                    this.from = objMessage['from']
                    break
                default:
            }
            // ws当前连接映射
            var targetConnection = userConnectionMap.get(objMessage['from'])
            if (targetConnection) {
                //清除该连接获取数据的定时器
                // clearInterval(userConnectionMap.get(`${objMessage['from']}_interval`))
                // let { category, params, from } = objMessage
                logger.trace(objMessage['from'], '发送了一条消息: ', objMessage)
                let { ZNM, YSJ, SJW, from } = objMessage
                clearAllInterval(userConnectionMap, objMessage, from)

                // let user_spec_event = ''
                //清除所有的监听器
                update_message.removeAllListeners()
                logger.trace('YSJ listeners number: ', update_message.listeners('ysj_updated').length, 'ZNM listeners number: ', update_message.listeners('znm_updated').length)
                    //类别与请求参数
                    // logger.info('分类： ', category, '参数： ', params,'from：  ', from)
                logger.info('ZNM: ', ZNM, 'YSJ： ', YSJ, 'SJW: ', SJW, 'from：  ', from)
                    // status  #1则返回全部,不筛选, 0则过滤词网站数据，不发送此网站。
                if (ZNM.status == 1 && YSJ.status == 1 && SJW.status == 1) {
                    //status全为1，获取所有的消息
                    update_message.on('ysj_updated', (msg) => {
                        logger.info('default_ysj 更新消息并发送')
                        var formattedMsg = formatYSJItems(msg)
                        targetConnection.send(JSON.stringify(formattedMsg))
                    })
                    update_message.on('znm_updated', (msg) => {
                        logger.info('default_znm 更新消息并发送')
                        var formattedMsg = formatZNMItems(msg)
                        targetConnection.send(JSON.stringify(formattedMsg))
                    })
                } else {
                    //分别判断YSJ筛选参数
                    if (YSJ.status == 1) {
                        // 获取全部YSJ数据
                        update_message.on('ysj_updated', (msg) => {
                            logger.info('default_ysj')
                            var formattedMsg = formatYSJItems(msg)
                            targetConnection.send(JSON.stringify(formattedMsg))
                        })
                    } else {
                        // userConnectionMap用来创建特定的定时器请求以获取更新数据 targetConnection发送更新数据
                        getSpecYSJData(from, YSJ, userConnectionMap, targetConnection)
                    }
                    // 分别判断ZNM筛选参数
                    if (ZNM.status == 1) {
                        // 获取全部ZNM数据
                        update_message.on('znm_updated', (msg) => {
                            logger.info('default_znm')
                            var formattedMsg = formatYSJItems(msg)
                            targetConnection.send(JSON.stringify(formattedMsg))
                        })
                    } else {
                        // userConnectionMap用来创建特定的定时器请求以获取更新数据 targetConnection发送更新数据
                        getSpecYSJData(from, ZNM, userConnectionMap, targetConnection)
                    }
                    // 分别判断SJW筛选参数
                    if (SJW.status == 1) {
                        // 获取全部SJW数据
                        update_message.on('znm_updated', (msg) => {
                            logger.info('default_znm')
                            var formattedMsg = formatYSJItems(msg)
                            targetConnection.send(JSON.stringify(formattedMsg))
                        })
                    } else {
                        // userConnectionMap用来创建特定的定时器请求以获取更新数据 targetConnection发送更新数据
                        getSpecYSJData(from, SJW, userConnectionMap, targetConnection)
                    }
                }
                // switch(category) {
                //     case 'YSJ':
                //         if(params === '') {
                //             //获取YSJ所有数据
                //             update_message.on('ysj_updated', (msg) => {
                //                 logger.info('YSJJJJJJJJJ')
                //                 var formattedMsg = formatYSJItems(msg)
                //                 targetConnection.send(JSON.stringify(formattedMsg))
                //             })
                //         } else {
                //             // 获取带有筛选参数的YSJ更新数据
                //             // userConnectionMap用来创建特定的定时器请求以获取更新数据 targetConnection发送更新数据
                //             getSpecYSJData(from, status, params, userConnectionMap, targetConnection)
                //         }
                //         break
                //     case 'ZNM':
                //         //获取ZNM所有数据
                //         update_message.on('znm_updated', (msg) => {
                //             logger.info('ZNMMMMMMMMM')
                //             var formattedMsg = formatZNMItems(msg)
                //             targetConnection.send(JSON.stringify(formattedMsg))
                //         })
                //         break
                //     default:
                //         //默认获取所有的更新数据
                //         update_message.on('ysj_updated', (msg) => {
                //             logger.info('default_ysj')
                //             var formattedMsg = formatYSJItems(msg)
                //             targetConnection.send(JSON.stringify(formattedMsg))
                //         })
                //         update_message.on('znm_updated', (msg) => {
                //             logger.info('default_znm')
                //             var formattedMsg = formatZNMItems(msg)
                //             targetConnection.send(JSON.stringify(formattedMsg))
                //         })
                //         break
                // }
                targetConnection.send(`${objMessage.from}, nice to meet you!`)
                logger.trace('YSJ listeners number: ', update_message.listeners('ysj_updated').length, 'ZNM listeners number: ', update_message.listeners('znm_updated').length)

            }
        })

        ws.on('close', function(code) {
            let { from, objMessage } = this
            logger.info('connection closed.....', this.from, userConnectionMap.get(`${from}_interval`))
                //清除该连接获取数据的定时器
                // clearInterval(userConnectionMap.get(`${from}_interval`))
            clearAllInterval(userConnectionMap, from)
            userConnectionMap.remove(from)
        })
    })
}