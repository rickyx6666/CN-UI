import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AuthButton } from '../auth/AuthButton'
import { VerifyCodeField } from '../auth/VerifyCodeField'
import { AddVerificationMethodSheet } from '../account/AddVerificationMethodSheet'
import { SwitchVerifyMethodSheet } from './SwitchVerifyMethodSheet'
import { SecurityVerifyUnavailableSheet } from './SecurityVerifyUnavailableSheet'
import { isValidOtp } from '../../data/auth'
import type { UserProfile } from '../../data/mock'
import {
  getDefaultActiveMethod,
  getMethodHelperText,
  getRequiredSecurityMethods,
  getSwitchableSecurityMethods,
  securityVerifyMethodMeta,
  type SecurityVerifyMethodId,
  type SecurityVerifySceneConfig,
} from '../../data/securityVerify'
import { usePrototype } from '../../context/PrototypeContext'

interface MultiFactorSecurityVerifyFormProps {
  config: SecurityVerifySceneConfig
  onSuccess: () => void
  onRequireGoogleSetup: () => void
  /** 未登录场景（如找回密码）传入模拟账户资料 */
  userOverride?: UserProfile
}

type VerifyValues = Partial<Record<SecurityVerifyMethodId, string>>
type VerifyErrors = Partial<Record<SecurityVerifyMethodId, string>>
type CodeSentState = Partial<Record<SecurityVerifyMethodId, boolean>>

export function MultiFactorSecurityVerifyForm({
  config,
  onSuccess,
  onRequireGoogleSetup,
  userOverride,
}: MultiFactorSecurityVerifyFormProps) {
  const { user: contextUser, openSupportCenter } = usePrototype()
  const user = userOverride ?? contextUser
  const [values, setValues] = useState<VerifyValues>({})
  const [errors, setErrors] = useState<VerifyErrors>({})
  const [loading, setLoading] = useState(false)
  const [showVerificationSheet, setShowVerificationSheet] = useState(false)
  const [showSwitchSheet, setShowSwitchSheet] = useState(false)
  const [showUnavailableSheet, setShowUnavailableSheet] = useState(false)
  const [codeSent, setCodeSent] = useState<CodeSentState>({})
  const [activeMethod, setActiveMethod] = useState<SecurityVerifyMethodId>(() =>
    getDefaultActiveMethod(user, ['google', 'email', 'phone']),
  )
  const [contactMethod, setContactMethod] = useState<SecurityVerifyMethodId>(() =>
    getDefaultActiveMethod(user, ['email', 'phone']),
  )

  const { scenario } = config

  const requiredMethods = useMemo(
    () => getRequiredSecurityMethods(user, scenario, activeMethod, contactMethod),
    [user, scenario, activeMethod, contactMethod],
  )

  const visibleMethods = useMemo(() => {
    switch (scenario) {
      case 'single':
        return [activeMethod]
      case 'google-email':
        return ['google', 'email'] as SecurityVerifyMethodId[]
      case 'google-contact':
        return ['google', contactMethod] as SecurityVerifyMethodId[]
      case 'contact':
        return [activeMethod]
      case 'email-phone':
        return ['email', 'phone'] as SecurityVerifyMethodId[]
      case 'google-email-phone':
        return ['google', 'email', 'phone'] as SecurityVerifyMethodId[]
    }
  }, [scenario, activeMethod, contactMethod])

  const switchableMethods = useMemo(
    () =>
      getSwitchableSecurityMethods(user, scenario, activeMethod, contactMethod),
    [user, scenario, activeMethod, contactMethod],
  )

  const needsGoogleBinding =
    visibleMethods.includes('google') && !user.googleAuthBound

  useEffect(() => {
    if (needsGoogleBinding) {
      setShowVerificationSheet(true)
    }
  }, [needsGoogleBinding])

  function updateValue(method: SecurityVerifyMethodId, value: string) {
    setValues((current) => ({ ...current, [method]: value }))
    setErrors((current) => ({ ...current, [method]: undefined }))
  }

  async function handlePaste(method: SecurityVerifyMethodId) {
    try {
      const text = await navigator.clipboard.readText()
      updateValue(method, text.replace(/\D/g, '').slice(0, 6))
    } catch {
      setErrors((current) => ({
        ...current,
        [method]: '无法读取剪贴板，请手动输入验证码',
      }))
    }
  }

  function handleSendCode(method: SecurityVerifyMethodId) {
    setCodeSent((current) => ({ ...current, [method]: true }))
  }

  function handleSwitchMethod(method: SecurityVerifyMethodId) {
    if (scenario === 'google-contact') {
      setContactMethod(method)
      setErrors((current) => ({ ...current, [method]: undefined }))
      return
    }

    setActiveMethod(method)
    setErrors({})
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (needsGoogleBinding) {
      setShowVerificationSheet(true)
      return
    }

    const nextErrors: VerifyErrors = {}
    for (const method of requiredMethods) {
      const value = values[method] ?? ''
      if (!isValidOtp(value)) {
        nextErrors[method] = '请输入 6 位验证码'
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 500)
  }

  function renderMethodField(method: SecurityVerifyMethodId) {
    if (method === 'google') {
      if (!user.googleAuthBound) {
        return (
          <div
            key="google"
            className="mb-4 rounded-lg border border-border-subtle bg-sunken px-4 py-3 text-body-sm text-secondary"
          >
            尚未绑定身份验证器，请先完成绑定。
          </div>
        )
      }

      return (
        <VerifyCodeField
          key="google"
          label={securityVerifyMethodMeta.google.fieldLabel}
          value={values.google ?? ''}
          onChange={(value) => updateValue('google', value)}
          error={errors.google}
          placeholder={securityVerifyMethodMeta.google.placeholder}
          suffixLabel="粘贴"
          onSuffixClick={() => handlePaste('google')}
        />
      )
    }

    const sent = codeSent[method] ?? false

    return (
      <VerifyCodeField
        key={method}
        label={securityVerifyMethodMeta[method].fieldLabel}
        value={values[method] ?? ''}
        onChange={(value) => updateValue(method, value)}
        error={errors[method]}
        placeholder={securityVerifyMethodMeta[method].placeholder}
        helperText={getMethodHelperText(user, method)}
        suffixLabel={sent ? '重新发送' : '获取验证码'}
        onSuffixClick={() => handleSendCode(method)}
      />
    )
  }

  return (
    <>
      <p className="mb-5 text-body-sm text-secondary">{config.hint}</p>

      <form onSubmit={handleSubmit}>
        {visibleMethods.map((method) => renderMethodField(method))}

        <AuthButton type="submit" loading={loading}>
          {config.submitLabel}
        </AuthButton>
      </form>

      <div className="mt-4 space-y-3">
        {switchableMethods.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowSwitchSheet(true)}
            className="text-body-sm text-brand active:opacity-70"
          >
            切换至其他验证方式
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setShowUnavailableSheet(true)}
          className="block text-body-sm text-brand active:opacity-70"
        >
          安全验证不可用？
        </button>
      </div>

      <SwitchVerifyMethodSheet
        open={showSwitchSheet}
        methods={switchableMethods}
        onClose={() => setShowSwitchSheet(false)}
        onSelect={handleSwitchMethod}
      />

      <AddVerificationMethodSheet
        open={showVerificationSheet}
        onClose={() => setShowVerificationSheet(false)}
        onEnable={() => {
          setShowVerificationSheet(false)
          onRequireGoogleSetup()
        }}
        defaultMethod="authenticator"
      />

      <SecurityVerifyUnavailableSheet
        open={showUnavailableSheet}
        onClose={() => setShowUnavailableSheet(false)}
        onContactSupport={openSupportCenter}
      />
    </>
  )
}
