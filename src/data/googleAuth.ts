export const googleAuthCopy = {
  boundPageTitle: '身份验证器App验证',
  boundMethodLabel: '身份验证器App',
  boundAddedPrefix: '添加于：',
  securityTipTitle: '安全提示',
  securityTipBody:
    '为保障您的加密货币资金安全，我们强烈建议您在适用的情况下禁用身份验证器的云同步功能。',
} as const

export function formatGoogleAuthBoundDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export const defaultGoogleAuthBoundAt = '2021-10-28'
