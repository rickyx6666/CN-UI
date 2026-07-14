import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { TextField } from '../../components/auth/TextField'
import { usePrototype } from '../../context/PrototypeContext'
import { accountCopy, securityVerifyScreen } from '../../data/account'
import { isValidOtp } from '../../data/auth'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function SecurityGoogleVerifyPage() {
  const { navigateAccount, updateProfile, antiPhishingDraft, paymentPasswordDraft } =
    usePrototype()
  const [phoneCode, setPhoneCode] = useState('')
  const [googleCode, setGoogleCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ phoneCode?: string; googleCode?: string }>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isValidOtp(phoneCode)) next.phoneCode = '请输入 6 位手机验证码'
    if (!isValidOtp(googleCode)) next.googleCode = '请输入 6 位谷歌验证码'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      updateProfile({ googleAuthBound: true })
      setLoading(false)
      if (antiPhishingDraft) {
        navigateAccount(securityVerifyScreen('anti-phishing'))
        return
      }
      if (paymentPasswordDraft) {
        navigateAccount(securityVerifyScreen('payment-password'))
        return
      }
      navigateAccount({ screen: 'security' })
    }, 400)
  }

  const content = (
    <form onSubmit={handleSubmit}>
      <TextField
        label="手机验证"
        value={phoneCode}
        onChange={(value) => setPhoneCode(value.replace(/\D/g, '').slice(0, 6))}
        placeholder="请输入验证码"
        error={errors.phoneCode}
        autoComplete="one-time-code"
        suffix={
          <button type="button" className="text-body-sm font-medium text-primary">
            获取验证码
          </button>
        }
      />
      <TextField
        label="新身份验证应用"
        value={googleCode}
        onChange={(value) => setGoogleCode(value.replace(/\D/g, '').slice(0, 6))}
        placeholder="请输入新身份验证应用验证码"
        error={errors.googleCode}
        autoComplete="one-time-code"
      />
      <AuthButton type="submit" loading={loading}>
        确认
      </AuthButton>
    </form>
  )

  return (
    <SubPageLayout
      title={accountCopy.googleVerifyTitle}
      onBack={() => navigateAccount({ screen: 'security-google-setup' })}
    >
      {content}
    </SubPageLayout>
  )
}
