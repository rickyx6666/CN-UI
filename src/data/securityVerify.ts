import type { UserProfile } from './mock'
import { maskEmail } from './account'

export type SecurityVerifyMethodId = 'google' | 'email' | 'phone'

/** 六种安全验证场景 */
export type SecurityVerifyScenario =
  | 'single' // 任选：Google / 邮箱 / 手机
  | 'google-email' // Google + 邮箱
  | 'google-contact' // Google + 邮箱/手机（二选一）
  | 'contact' // 邮箱/手机（二选一）
  | 'email-phone' // 邮箱 + 手机
  | 'google-email-phone' // Google + 邮箱 + 手机

export interface SecurityVerifySceneConfig {
  scenario: SecurityVerifyScenario
  hint: string
  submitLabel: string
}

export const securityVerifyScenarios: Record<
  SecurityVerifyScenario,
  SecurityVerifySceneConfig
> = {
  single: {
    scenario: 'single',
    hint: '为保障您的资产安全，请完成安全验证。',
    submitLabel: '提交',
  },
  'google-email': {
    scenario: 'google-email',
    hint: '为保障您的资产安全，请完成身份验证器与邮箱验证。',
    submitLabel: '提交',
  },
  'google-contact': {
    scenario: 'google-contact',
    hint: '请完成身份验证器验证，并通过邮箱或手机完成二次验证。',
    submitLabel: '提交',
  },
  contact: {
    scenario: 'contact',
    hint: '请通过邮箱或手机完成安全验证。',
    submitLabel: '提交',
  },
  'email-phone': {
    scenario: 'email-phone',
    hint: '请同时完成邮箱与手机验证。',
    submitLabel: '提交',
  },
  'google-email-phone': {
    scenario: 'google-email-phone',
    hint: '请完成身份验证器、邮箱与手机验证。',
    submitLabel: '提交',
  },
}

export const defaultSecurityVerifyScenario: SecurityVerifyScenario = 'google-email'

export function getSecurityVerifyConfig(
  scenario: SecurityVerifyScenario = defaultSecurityVerifyScenario,
): SecurityVerifySceneConfig {
  return securityVerifyScenarios[scenario]
}

export const securityVerifyMethodMeta: Record<
  SecurityVerifyMethodId,
  { title: string; fieldLabel: string; placeholder: string }
> = {
  google: {
    title: '身份验证器 App',
    fieldLabel: '身份验证器App',
    placeholder: '请输入 6 位验证码',
  },
  email: {
    title: '邮箱验证',
    fieldLabel: '邮箱验证码',
    placeholder: '请输入 6 位验证码',
  },
  phone: {
    title: '手机验证',
    fieldLabel: '手机验证码',
    placeholder: '请输入 6 位验证码',
  },
}

export const securityVerifyScenarioLabels: Record<SecurityVerifyScenario, string> = {
  single: '单因子（Google/邮箱/手机）',
  'google-email': 'Google + 邮箱',
  'google-contact': 'Google + 邮箱/手机',
  contact: '邮箱/手机',
  'email-phone': '邮箱 + 手机',
  'google-email-phone': 'Google + 邮箱 + 手机',
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return phone
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`
}

export function isSecurityMethodAvailable(
  user: UserProfile,
  method: SecurityVerifyMethodId,
): boolean {
  if (method === 'google') return user.googleAuthBound
  if (method === 'phone') return user.phoneBound && Boolean(user.phone)
  return Boolean(user.email)
}

export function getAvailableSecurityMethods(
  user: UserProfile,
  candidates: SecurityVerifyMethodId[],
): SecurityVerifyMethodId[] {
  return candidates.filter((method) => isSecurityMethodAvailable(user, method))
}

export function getDefaultActiveMethod(
  user: UserProfile,
  candidates: SecurityVerifyMethodId[],
): SecurityVerifyMethodId {
  const available = getAvailableSecurityMethods(user, candidates)
  return available[0] ?? 'email'
}

export function getRequiredSecurityMethods(
  user: UserProfile,
  scenario: SecurityVerifyScenario,
  activeMethod: SecurityVerifyMethodId,
  contactMethod: SecurityVerifyMethodId,
): SecurityVerifyMethodId[] {
  switch (scenario) {
    case 'single':
      return isSecurityMethodAvailable(user, activeMethod) ? [activeMethod] : []
    case 'google-email':
      return getAvailableSecurityMethods(user, ['google', 'email'])
    case 'google-contact':
      return getAvailableSecurityMethods(user, ['google', contactMethod])
    case 'contact':
      return isSecurityMethodAvailable(user, activeMethod) ? [activeMethod] : []
    case 'email-phone':
      return getAvailableSecurityMethods(user, ['email', 'phone'])
    case 'google-email-phone':
      return getAvailableSecurityMethods(user, ['google', 'email', 'phone'])
  }
}

export function getSwitchableSecurityMethods(
  user: UserProfile,
  scenario: SecurityVerifyScenario,
  activeMethod: SecurityVerifyMethodId,
  contactMethod: SecurityVerifyMethodId,
): SecurityVerifyMethodId[] {
  switch (scenario) {
    case 'single':
      return getAvailableSecurityMethods(user, ['google', 'email', 'phone']).filter(
        (method) => method !== activeMethod,
      )
    case 'google-contact':
      return getAvailableSecurityMethods(user, ['email', 'phone']).filter(
        (method) => method !== contactMethod,
      )
    case 'contact':
      return getAvailableSecurityMethods(user, ['email', 'phone']).filter(
        (method) => method !== activeMethod,
      )
    default:
      return []
  }
}

export function getMethodHelperText(
  user: UserProfile,
  method: SecurityVerifyMethodId,
): string | undefined {
  if (method === 'email') return `验证码将发送至 ${maskEmail(user.email)}`
  if (method === 'phone') return `验证码将发送至 ${maskPhone(user.phone)}`
  return undefined
}

export const securityVerifyUnavailableCopy = {
  title: '安全验证不可用？',
  intro: '如无法完成安全验证，可尝试以下方式：',
  items: [
    {
      title: '身份验证器不可用',
      description: '若丢失或无法使用身份验证器，请联系客服申请重置。',
    },
    {
      title: '未收到验证码',
      description: '请检查垃圾邮件文件夹，或确认手机信号正常后点击重新发送。',
    },
    {
      title: '仍无法完成验证',
      description: '请通过在线客服获取帮助，我们可能在核验身份后协助您处理。',
    },
  ],
  confirmLabel: '我知道了',
  contactLabel: '联系客服',
} as const
