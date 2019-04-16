var router = require('koa-router')();
const fetch = require('isomorphic-fetch');
const FormData = require('form-data');
const axios = require('axios')
const Qs = require('qs')
const http = require('http')

router.get('/', async function(ctx, next) {
    await ctx.render('index.html');

})

router.get('/foo', async function(ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});

router.get('/api', async function(ctx, next) {
    const url = 'http://www.912sc.cn/api.ashx?_t=1555248254372'
    const fd = new FormData()
    fd.append('method', 'lessPrice')
    fd.append('maxId', 3400209)
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/json,text/javascript,*/*;q=0.01',
            'Origin': 'http://www.912sc.cn',
            'Referer': 'http: //www.912sc.cn/'
        },
        body: {
            method: 'lessPrice',
            maxId: 3400209
        }
    }).then(res => {
        if (res.ok) {
            ctx.body = res.body
        }
    }).catch(err => console.log(err))

})

router.get('/axios', async function(ctx, next) {
    const url = 'http://www.912sc.cn/api.ashx?_t=1555248254372'
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
            head: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Origin': 'http://www.912sc.cn',
                'Referer': 'http://www.912sc.cn/'
            },
            // params: { _t: 1555248254372 },
            // paramsSerializer: function(params) {
            //     return Qs.stringify(params, { arrayFormat: 'brackets' })
            // },
            data: fd
        })
        .then(response => {
            // console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
            console.log(response.data, 'res')
            ctx.body = response.data
        })
        .catch(error => {
            console.log(error);
        });
});


router.get('/native', async function(ctx, next) {
    var content = Qs.stringify({
        'method': 'lessPrice',
        'maxId': '3400209'
    })
    await http.request({
        hostname: 'http://www.912sc.cn',
        port: 80,
        method: 'POST',
        path: 'api.ashx?_t=1555248254372' + content,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Origin': 'http://www.912sc.cn',
            'Referer': 'http: //www.912sc.cn/'
        }
    }, function(res) {
        res.setEncoding('utf8');
        console.log('STATUS: ' + res.statusCode)
        console.log('HEADERS: ' + JSON.stringify(res.headers))
        console.log(res, 'ressssssss')
        ctx.render('index', {
            title: 'koa2 foo'
        });
    })

});
module.exports = router;