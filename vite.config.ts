import { networkInterfaces } from 'node:os'
import { realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const projectRoot = realpathSync.native(
  path.dirname(fileURLToPath(import.meta.url)),
)

function getLanIp() {
  for (const interfaces of Object.values(networkInterfaces())) {
    for (const item of interfaces ?? []) {
      if (item.family === 'IPv4' && !item.internal) {
        return item.address
      }
    }
  }
  return null
}

/** 保存后整页强刷，避免 HMR 状态残留 */
function fullReloadOnUpdate(): Plugin {
  return {
    name: 'coinlab-full-reload',
    handleHotUpdate({ server }) {
      server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}

function devIdentityBanner(): Plugin {
  return {
    name: 'coinlab-dev-banner',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer?.address()
        const port = typeof addr === 'object' && addr ? addr.port : 5173
        const lanIp = getLanIp()
        console.log('\n  🟡 CoinLab — 本地开发')
        console.log(`  ➜  本机     http://127.0.0.1:${port}/`)
        if (lanIp) {
          console.log(`  ➜  局域网   http://${lanIp}:${port}/`)
        }
        console.log('  （Cash Caw 请用 http://localhost:5175/demo）\n')
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  root: projectRoot,
  /** GitHub Pages 项目页：https://rickyx6666.github.io/CN-UI/ */
  base: command === 'serve' ? '/' : '/CN-UI/',
  plugins: [react(), fullReloadOnUpdate(), devIdentityBanner()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { port: 51733 },
    fs: {
      strict: false,
      allow: [
        projectRoot,
        path.resolve(projectRoot, '..'),
        path.resolve(projectRoot, '../..'),
        '/Users/run',
      ],
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
}))
