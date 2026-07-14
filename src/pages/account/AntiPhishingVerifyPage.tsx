import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { TextField } from '../../components/auth/TextField'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { antiPhishingCopy } from '../../data/antiPhishing'
import { isValidOtp } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

export function AntiPhishingVerifyPage() {
  const {
    antiPhishingDraft,
    user,
    navigateAccount,
    setAntiPhishingDraft,
    updateProfile,
  } = usePrototype()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  function handleBack() {
    navigateAccount({
      screen: 'security-anti-phishing-form',
      antiPhishingMode: user.antiPhishingCode ? 'change' : 'create',
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!antiPhishingDraft) {
      navigateAccount({ screen: 'security-anti-phishing' })
      return
    }
    if (!isValidOtp(otp)) {
      setError('请输入 6 位 Google 验证码')
      return
    }

    setError(undefined)
    setLoading(true)
    window.setTimeout(() => {
      updateProfile({ antiPhishingCode: antiPhishingDraft })
      setAntiPhishingDraft(null)
      setLoading(false)
      navigateAccount({ screen: 'security-anti-phishing' })
    }, 400)
  }

  return (
    <SubPageLayout
      title={antiPhishingCopy.verifyTitle}
      onBack={handleBack}
    >
      <p className="mb-6 text-body-sm text-secondary">
        {antiPhishingCopy.verifyHint}
      </p>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Google 验证器"
          value={otp}
          onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
          placeholder="请输入验证码"
          error={error}
          autoComplete="one-time-code"
          suffix={
            <button
              type="button"
              onClick={() => setOtp('123456')}
              className="text-body-sm font-medium text-brand"
            >
              粘贴
            </button>
          }
        />

        <AuthButton type="submit" loading={loading}>
          {antiPhishingCopy.submitButton}
        </AuthButton>
      </form>
    </SubPageLayout>
  )
}
