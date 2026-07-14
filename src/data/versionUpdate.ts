export type VersionUpdateVariant = 'force' | 'soft'

export interface VersionUpdateInfo {
  latestVersion: string
  currentVersion: string
  highlights: string[]
}

export const versionUpdateCopy = {
  softTitle: '为提升体验，请将 App 更新至最新版本。',
  forceTitle: '请更新至最新版本以继续使用',
  changelogTitle: '更新内容',
  softSummary:
    '我们对应用程序进行了优化，以提供更流畅的体验。更多更新，敬请期待！',
  forceSummary:
    '您当前使用的版本已停止维护，我们不再为旧版本提供安全更新与技术支持。请立即升级，以保障您的账户与资产安全。',
  updateButton: '更新',
  laterButton: '稍后提醒',
} as const

export const defaultVersionUpdateInfo: VersionUpdateInfo = {
  latestVersion: '2.1.0',
  currentVersion: '2.0.3',
  highlights: ['优化交易性能与稳定性', '新增合约模块功能', '修复已知安全问题'],
}
