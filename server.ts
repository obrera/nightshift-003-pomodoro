import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const app = new Hono()

// Serve static files from dist
app.use('/*', serveStatic({ root: './dist' }))

// Fallback to index.html for SPA routing
app.get('/*', serveStatic({ path: './dist/index.html' }))

const port = parseInt(process.env.PORT || '3001')

console.log(`🍅 Pomodoro Timer running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}
