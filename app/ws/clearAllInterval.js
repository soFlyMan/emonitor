module.exports = function(userConnectionMap, objMessage, from) {
    clearInterval(userConnectionMap.get(`${objMessage['from']}_znm_interval`))
    clearInterval(userConnectionMap.get(`${objMessage['from']}_ysj_interval`))
    clearInterval(userConnectionMap.get(`${objMessage['from']}_sjw_interval`))
}