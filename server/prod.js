const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const sendFile = require('koa-send')

const resolve = (p) => path.resolve(__dirname, p)

const app = new Koa()

const clientRoot = resolve('../dist/client')
const template = fs.readFileSync(resolve('../dist/client/index.html'), 'utf-8')
const { render } = require('../dist/server/entry-server.js')
const manifest = require('../dist/client/ssr-manifest.json')

;(async () => {
  app.use(async (ctx) => {
    if (ctx.path.startsWith('/assets')) {
      await sendFile(ctx, ctx.path, { root: clientRoot })
      return
    }

    const [apphtml, preloadLinks, piniaState] = await render(ctx, manifest)

    const html = template
      .replace(`<!--ssr-outlet-->`, apphtml)
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--pinia-state-->`, piniaState)

    ctx.type = 'text/html'
    ctx.body = html
  });

  app.listen(3000, () => console.log('started server on http://localhost:3000'))
})()
