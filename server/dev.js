const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaConnect = require('koa-connect')
const { createServer } = require('vite')

const resolve = (p) => path.resolve(__dirname, p);

const app = new Koa()

const template = fs.readFileSync(
  resolve('../index.html'),
  'utf-8',
)

;(async () => {
  const vite = await createServer({
    root: process.cwd(),
    logLevel: 'error',
    server: {
      middlewareMode: 'ssr',
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 250
      }
    },
  })

  app.use(koaConnect(vite.middlewares))

  app.use(async (ctx) => {
    try {
      const viteTemplate = await vite.transformIndexHtml(ctx.path, template)

      const { render } = await vite.ssrLoadModule(
        resolve('../src/entry-server.js')
      )

      const [apphtml, preloadLinks, piniaState] = await render(ctx.path, {})

      const html = viteTemplate
        .replace(`<!--ssr-outlet-->`, apphtml)
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--pinia-state-->`, piniaState)

      ctx.type = 'text/html'
      ctx.body = html
    } catch (err) {
      vite && vite.ssrFixStacktrace(err)
      console.log(err.stack)
      ctx.throw(500, err.stack)
    }
  })

  app.listen(8000, () => {
    console.log('server is listening in 8000')
  })
})()
