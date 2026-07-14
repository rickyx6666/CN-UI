export const appInfo = {
  name: 'CoinNova',
  version: '0.1.0',
  build: '2026071401',
} as const

export interface SocialContact {
  id: 'x' | 'telegram'
  label: string
  href: string
}

export const socialContacts: SocialContact[] = [
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/CoinNova',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/CoinNova',
  },
]

export const aboutCopy = {
  title: '关于',
  userAgreement: '用户协议',
  privacyPolicy: '隐私协议',
  checkUpdate: '检查更新',
  contactTitle: '关注我们',
} as const
