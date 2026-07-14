import { getFigmaScreen } from './screens'
import type { FigmaScreenEntry } from './types'

export type FigmaRoute =
  | { type: 'index' }
  | { type: 'design-system' }
  | { type: 'design-system-doc'; slug: string }
  | { type: 'screen'; screen: FigmaScreenEntry }

/** 去掉 Vite base（dev `/`，Pages `/CN-UI/`） */
export function stripBasePath(pathname: string): string {
  const base = import.meta.env.BASE_URL
  if (base === '/') return pathname
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  if (pathname === prefix || pathname === `${prefix}/`) return '/'
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length)
  }
  return pathname
}

export function resolveFigmaRoute(appPath: string): FigmaRoute | null {
  const normalized = appPath.replace(/\/+$/, '') || '/'

  if (normalized === '/figma') {
    return { type: 'index' }
  }

  if (normalized === '/figma/design-system') {
    return { type: 'design-system' }
  }

  const docMatch = normalized.match(/^\/figma\/docs\/([^/]+)$/)
  if (docMatch) {
    return { type: 'design-system-doc', slug: docMatch[1] }
  }

  if (!normalized.startsWith('/figma/')) {
    return null
  }

  const screenPath = normalized.slice('/figma/'.length)
  const screen = getFigmaScreen(screenPath)
  if (!screen) return null

  return { type: 'screen', screen }
}

/** 线上 GitHub Pages 根地址，Figma / html.to.design 导入用 */
export const FIGMA_PAGES_ORIGIN = 'https://rickyx6666.github.io/CN-UI'

/** 完整可粘贴的 Figma 导出直链；开发环境用 localhost，线上用 GitHub Pages */
export function figmaExportUrl(path: string): string {
  const slug = path.replace(/^\/+/, '').replace(/\/+$/, '')
  if (import.meta.env.DEV) {
    if (typeof window !== 'undefined') {
      return figmaPageUrl(slug)
    }
    return `http://127.0.0.1:5173/figma${slug ? `/${slug}` : ''}`
  }
  if (!slug) return `${FIGMA_PAGES_ORIGIN}/figma`
  return `${FIGMA_PAGES_ORIGIN}/figma/${slug}`
}

export function figmaPageUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const slug = path.replace(/^\/+/, '')
  const joined = `${base}figma/${slug}`.replace(/\/{2,}/g, '/')
  return `${window.location.origin}${joined.startsWith('/') ? joined : `/${joined}`}`
}
