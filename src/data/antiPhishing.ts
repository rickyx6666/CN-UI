export const antiPhishingCopy = {
  title: '防钓鱼码',
  howItWorksTitle: '防钓鱼码如何运作？',
  howItWorksDesc:
    '您可以创建自己的防钓鱼码，显示在 CoinNova 官方电子邮件和短信中。此功能可协助您验证 CoinNova 通讯的真实性。',
  howItWorksSheetDesc:
    '您可以创建自己的防钓鱼码，显示在 CoinNova 官方邮件和短信中，便于您验证相关沟通是否真的来自于 CoinNova。',
  acknowledgedButton: '已知晓',
  createTitle: '创建防钓鱼码',
  changeTitle: '更改防钓鱼码',
  verifyTitle: 'Google 验证器验证',
  verifyHint: '请输入验证器 App 生成的 6 位数验证码。',
  passwordNote: '注意：这不是您的账户密码。',
  currentLabel: '目前的防钓鱼码',
  createButton: '建立',
  changeButton: '更改防钓鱼码',
  submitButton: '提交',
  addVerificationTitle: '需添加其他验证方式',
  addVerificationDesc: '为确保您的账户安全，您需要再添加至少1种验证方式。',
  passkeyLabel: '通行密钥',
  passkeyHint: '通过生物识别或安全密钥验证',
  authenticatorLabel: '身份验证器App',
  recommended: '推荐',
  enableButton: '启用',
} as const

export const antiPhishingRules = [
  { id: 'length', label: '6-8 个字符' },
  { id: 'charset', label: '仅限英文字母、数字或下划线 (A-Z、a-z、0-9、_)' },
  { id: 'notAllSame', label: '字符不得全部相同' },
] as const

export type AntiPhishingRuleId = (typeof antiPhishingRules)[number]['id']

export function validateAntiPhishingCode(code: string) {
  const length = code.length >= 6 && code.length <= 8
  const charset = /^[A-Za-z0-9_]+$/.test(code)
  const notAllSame = code.length > 0 && !/^(.)\1+$/.test(code)

  return { length, charset, notAllSame }
}

export function isValidAntiPhishingCode(code: string) {
  const rules = validateAntiPhishingCode(code)
  return rules.length && rules.charset && rules.notAllSame
}

export function maskAntiPhishingCode(code: string, visible: boolean) {
  if (visible) return code
  if (code.length <= 2) return '*'.repeat(code.length)
  return `${code.slice(0, 2)}${'*'.repeat(code.length - 2)}`
}

/** 原型调试 / 演示交互：一键跳转防钓鱼码各状态 */
export type AntiPhishingDemoScene =
  | 'intro'
  | 'set'
  | 'how-it-works'
  | 'create'
  | 'change'
  | 'verify'

export const antiPhishingDemoScenes: {
  id: AntiPhishingDemoScene
  label: string
}[] = [
  { id: 'intro', label: '介绍' },
  { id: 'set', label: '已设置' },
  { id: 'how-it-works', label: '如何运作' },
  { id: 'create', label: '创建' },
  { id: 'change', label: '更改' },
  { id: 'verify', label: '验证' },
]
