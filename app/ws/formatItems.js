// var items = [{
//     Id: 3490819,
//     Minprice: "185",
//     Oldprice: "245",
//     SiteId: 7,
//     SiteName: "网易考拉",
//     SpImg: "https://haitao.nos.netease.com/7a9b93f1511b4ce7bdb06b13db11b82e1544671600295jpm1l6s211960.jpg?imageView&#38thumbnail=262x262&#38quality=90",
//     SpName: "【祛黄美颜好气色】Salus 莎露斯 Floradix 德国铁元 补铁养血营养液红色版500毫升 2瓶",
//     SpUrl: "/UrlRedirect.aspx?proid=3490819",
//     Spprice: "185",
//     Youhui: "",
//     Zhekou: "7.6",
//     Ziying: "自营",
//     Zkcss: "8",
//     time: "19:39"
// }]

// 折扣 discount 0.653
// 商城 mall
// 商品链接 itemUrl
// 商品标题 itemName
// 商品图 itemImg
// 当前价 currentPrice
// 之前价 preventPrice
// 是否神价 isStar
// 商品类别 itemType
function formatZNMItems(items) {
    var newItems = []
        // var types = ['1电脑办公', '2电脑办公', '3电脑办公', '4电脑办公', '5电脑办公', '6电脑办公', '7家用电器', '8电脑办公', '9电脑办公', '10电脑办公']
    items.map(item => {
            // let newUrl = JSON.parse(data.body)
            // logger.info('Joke: ', content.value)
            newItems.push(Object.assign({}, {
                    itemName: item.SpName,
                    discount: item.Zhekou,
                    mall: item.SiteName,
                    itemID: item.Id,
                    itemUrl: `http://www.912sc.cn/UrlRedirect.aspx?proid=${item.Id}`,
                    itemImg: item.SpImg,
                    currentPrice: item.Spprice,
                    preventPrice: item.Oldprice,
                    isStar: false,
                    itemType: item.Zkcss,
                    dataFrom: 'ZNM'
                }))
                // let newUrl = extractItemUrl(`http://www.912sc.cn/UrlRedirect.aspx?proid=${item.Id}`)
        })
        // logger.info(newItems)
    return newItems
}

// bcj: false
// categoryId: "108"
// categoryName: "家居家装"
// createTime: 1555649650895
// discount: 0.322
// dsId: 10
// dsName: "唯品会"
// goodsId: "100050504-657635097097160"
// goodsImgPath: "//h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcpos/1100004046/2019/0330/69/ac439b58-546a-435c-99a0-50000ad8b7a0_5t.jpg"
// goodsName: "席韵家纺 印花拉绒防滑地垫门垫地毯浴室卫生间脚垫吸水垫防滑垫"
// id: 62754084
// jdType: null
// leimuId: null
// leimuName: null
// origin: 0
// prevPrice: 78.8
// price: 25.34
// shopId: null
// sj: false
// upTime: null
// username: null
// venderId: null
function formatYSJUrl(mall, id) {
    // logger.info(mall, id)
    switch (mall) {
        case '唯品会':
            return `https://detail.vip.com/detail-${id}.html`
        case '京东':
            return `https://item.jd.com/${id}.html`
        case '京东自营':
            return `https://item.jd.com/${id}.html`
        case '京东三方':
            return `https://item.jd.com/${id}.html`
        case '天猫超市':
            return `https://chaoshi.detail.tmall.com/item.htm?id=${id}`
        case '天猫商城':
            return `https://detail.tmall.com/item.htm?id=${id}`
        case '苏宁':
            return `https://product.suning.com/0000000000/${id}.html`
        case '亚马逊中国':
            return `https://www.amazon.cn/dp/B07JGW1DCR/ref=sr_1_1?__mk_zh_CN=亚马逊网站&qid=${id}&s=gateway&sr=8-1`
        case '网易考拉':
            return `https://goods.kaola.com/product/${id}.html`
        case '国美在线':
            return `https://item.gome.com.cn/${id}.html`
        default:
            return 'mall'
    }

}

function formatYSJItems(items) {
    var newItems = []
        // var types = ['1电脑办公', '2电脑办公', '3电脑办公', '4电脑办公', '5电脑办公', '6电脑办公', '7家用电器', '8电脑办公', '9电脑办公', '10电脑办公']
    items.map(item => {
            // let newUrl = JSON.parse(data.body)
            // logger.info('Joke: ', content.value)
            newItems.push(Object.assign({}, {
                    itemName: item.goodsName,
                    discount: item.discount,
                    mall: item.dsName,
                    itemID: item.goodsId,
                    itemUrl: formatYSJUrl(item.dsName, item.goodsId),
                    itemImg: item.goodsImgPath,
                    currentPrice: item.price,
                    preventPrice: item.prevPrice,
                    isStar: item.sj,
                    itemType: item.categoryName,
                    dataFrom: 'YSJ'
                }))
                // let newUrl = extractItemUrl(`http://www.912sc.cn/UrlRedirect.aspx?proid=${item.Id}`)
        })
        // logger.info(newItems)
    return newItems
}

module.exports = {
    formatZNMItems,
    formatYSJItems
}