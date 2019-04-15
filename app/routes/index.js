var router = require('koa-router')();

router.get('/', async function(ctx, next) {
    await ctx.render('index.html');
})

router.get('/foo', async function(ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});

module.exports = router;