#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const expectedDir = 'exchange-app-coinlab'
const port = 5173
const label = 'CoinLab'

function getListenerCwd(pid) {
  try {
    return execSync(`lsof -p ${pid} 2>/dev/null | awk '/cwd/{print $NF}'`, {
      encoding: 'utf8',
    }).trim()
  } catch {
    return ''
  }
}

function getPidsOnPort(p) {
  try {
    return execSync(`lsof -ti:${p} -sTCP:LISTEN 2>/dev/null`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean)
  } catch {
    return []
  }
}

const pids = getPidsOnPort(port)
for (const pid of pids) {
  const cwd = getListenerCwd(pid)
  if (cwd && !cwd.endsWith(expectedDir)) {
    console.error(`\n❌ 端口 ${port} 已被其它项目占用：\n   ${cwd}`)
    console.error(`\n请先停止该进程，再启动 ${label}：`)
    console.error(`   lsof -ti:${port} | xargs kill`)
    console.error(`   cd ~/${expectedDir} && npm run dev\n`)
    process.exit(1)
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')

const child = spawn('node', [viteBin], { stdio: 'inherit', cwd: root })
child.on('exit', (code) => process.exit(code ?? 0))
