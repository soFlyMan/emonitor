var router = require('koa-router')();
// const fetch = require('isomorphic-fetch');
// const FormData = require('form-data');
const axios = require('axios')
    // const Qs = require('qs')
    // const http = require('http')

router.get('/', async function(ctx, next) {
    await ctx.render('index.html');

})

router.get('/foo', async function(ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});

router.get('/axios', async function(ctx, next) {
    var MAXID = 3400209
    const url = `http://www.912sc.cn/api.ashx?_t=${Date.now()}`
    var content = {
        'method': 'lessPrice',
        'maxId': '3400209'
    }
    const fd = new FormData(content)
    fd.append('method', 'lessPrice')
    fd.append('maxId', '3400209')
    await axios({
            url: url,
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Origin": "http://www.912sc.cn",
                "Referer": "http://www.912sc.cn/"
            },
            data: `method=lessPrice&maxId=${MAXID}`
        })
        .then(response => {
            MAXID = response.data.maxid
            ctx.body = response.data
        })
        .catch(error => {
            console.log(error);
        });
});


module.exports = router;