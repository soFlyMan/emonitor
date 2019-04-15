var router = require('koa-router')();
const fetch = require('isomorphic-fetch');
const FormData = require('form-data');

router.get('/', async function(ctx, next) {
    // const url = 'http://www.912sc.cn/api.ashx?_t=1555248254372'
    // const fd = new FormData()
    // fd.append('method', 'lessPrice')
    // fd.append('maxId', '3400209')
    // await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //         'Accept': 'application/json,text/javascript,*/*;q=0.01',
    //         'Origin': 'http://www.912sc.cn',
    //         'Referer': 'http: //www.912sc.cn/'

    //     },
    //     body: fd
    // }).then(function(response) {
    //     if (response.ok) {
    //         response.json().then(function(data) {
    //             console.log(12323123, data)
    //         }).catch(function(e) {
    //             console.log(e)
    //         })
    //     }
    // }).catch(function(err) {
    //     console.log(err)
    // })
    await ctx.render('index.html');

})

router.get('/foo', async function(ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});

module.exports = router;