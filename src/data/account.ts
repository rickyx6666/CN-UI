import { antiPhishingCopy } from './antiPhishing'
import type { UserProfile } from './mock'

export type SecurityVerifyPurpose = 'payment-password' | 'anti-phishing'

export type AccountScreenName =
  | 'hub'
  | 'invite'
  | 'profile'
  | 'security'
  | 'security-google'
  | 'security-google-setup'
  | 'security-google-verify'
  | 'security-email'
  | 'security-login-password'
  | 'security-payment-password'
  | 'security-verify'
  | 'security-anti-phishing'
  | 'security-anti-phishing-form'
  | 'kyc'
  | 'kyc-sumsub'
  | 'logout'
  | 'delete'
  | 'delete-verify'
  | 'delete-success'
  | 'about'
  | 'about-legal'

export interface AccountScreenState {
  screen: AccountScreenName
  antiPhishingMode?: 'create' | 'change'
  legalId?: string
  securityVerifyPurpose?: SecurityVerifyPurpose
}

export interface SecurityItem {
  id: string
  label: string
  hint?: string
  screen: AccountScreenName
  group?: 'basic' | 'advanced'
}

export const securityGroups = {
  basic: '基础安全',
  advanced: '更多安全设置',
} as const

export const accountCopy = {
  hubTitle: '账户设置',
  inviteTitle: '邀请好友',
  profileTitle: '个人资料',
  securityTitle: '安全设置',
  googleSetupTitle: 'Google 身份验证器',
  googleVerifyTitle: '安全验证',
  kycTitle: '身份认证',
  kycSumsubTitle: 'Sumsub 验证',
  logoutTitle: '退出登录',
  deleteTitle: '注销账户',
  deleteVerifyTitle: '安全验证',
  deleteSuccessTitle: '账户已注销',
  aboutTitle: '关于',
  securityVerifyTitle: '安全验证',
} as const

export function getSecurityVerifyMeta(
  purpose: SecurityVerifyPurpose,
  user: UserProfile,
) {
  if (purpose === 'payment-password') {
    const action = user.paymentPasswordSet ? '修改' : '设置'
    return {
      hint: `请完成身份验证器与邮箱验证，以${action}支付密码。`,
      submitLabel: user.paymentPasswordSet ? '确认修改' : '确认设置',
      backScreen: () => ({ screen: 'security-payment-password' as const }),
    }
  }

  return {
    hint: '请完成身份验证器与邮箱验证后继续设置防钓鱼码。',
    submitLabel: antiPhishingCopy.submitButton,
    backScreen: () => ({
      screen: 'security-anti-phishing-form' as const,
      antiPhishingMode: user.antiPhishingCode ? ('change' as const) : ('create' as const),
    }),
  }
}

export function securityVerifyScreen(
  purpose: SecurityVerifyPurpose,
): AccountScreenState {
  return { screen: 'security-verify', securityVerifyPurpose: purpose }
}

export const kycProviderCopy = {
  name: 'Sumsub',
  tagline: '身份验证由 Sumsub 提供',
  description:
    '我们接入 Sumsub 全球 KYC 服务，支持证件识别、活体检测与反欺诈筛查，符合国际 AML 合规要求。',
  sdkPlaceholder: 'Sumsub WebSDK',
  sdkHint: '正式环境将在此加载 Sumsub 验证组件',
} as const

export const deleteAccountWarnings = [
  '注销后账户数据将被永久删除，无法恢复',
  '账户内所有数字资产需先提现完毕，否则将视为放弃',
  '未完成订单、挂单将全部取消',
  '注销后同一邮箱 30 天内不可重新注册',
] as const

export const securityItems: SecurityItem[] = [
  {
    id: 'email',
    label: '邮箱',
    screen: 'security-email',
    group: 'basic',
  },
  {
    id: 'login-password',
    label: '登录密码',
    screen: 'security-login-password',
    group: 'basic',
  },
  {
    id: 'google',
    label: 'Google 验证器',
    screen: 'security-google',
    group: 'basic',
  },
  {
    id: 'payment-password',
    label: '支付密码',
    screen: 'security-payment-password',
    group: 'basic',
  },
  {
    id: 'phone',
    label: '手机验证',
    screen: 'security-email',
    group: 'advanced',
  },
  {
    id: 'anti-phishing',
    label: '防钓鱼码',
    screen: 'security-anti-phishing',
    group: 'advanced',
  },
]

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const visible = local.slice(0, 2)
  return `${visible}***@${domain}`
}
