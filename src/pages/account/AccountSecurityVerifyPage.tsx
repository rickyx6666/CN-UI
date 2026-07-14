import { useEffect, useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AddVerificationMethodSheet } from '../../components/account/AddVerificationMethodSheet'
import { OtpField } from '../../components/auth/OtpField'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import {
  accountCopy,
  getSecurityVerifyMeta,
} from '../../data/account'
import { isValidOtp } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

export function AccountSecurityVerifyPage() {
  const {
    accountScreen,
    antiPhishingDraft,
    paymentPasswordDraft,
    user,
    navigateAccount,
    setAntiPhishingDraft,
    setPaymentPasswordDraft,
    updateProfile,
  } = usePrototype()
  const purpose = accountScreen?.securityVerifyPurpose

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [showVerificationSheet, setShowVerificationSheet] = useState(false)

  useEffect(() => {
    if (!user.googleAuthBound) {
      setShowVerificationSheet(true)
    }
  }, [user.googleAuthBound])

  if (!purpose) return null

  const meta = getSecurityVerifyMeta(purpose, user)

  function handleBack() {
    navigateAccount(meta.backScreen())
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user.googleAuthBound) {
      setShowVerificationSheet(true)
      return
    }

    if (!isValidOtp(otp)) {
      setError('请输入 6 位 Google 验证码')
      return
    }

    if (purpose === 'payment-password' && !paymentPasswordDraft) {
      navigateAccount({ screen: 'security-payment-password' })
      return
    }

    if (purpose === 'anti-phishing' && !antiPhishingDraft) {
      navigateAccount({ screen: 'security-anti-phishing' })
      return
    }

    setError(undefined)
    setLoading(true)
    window.setTimeout(() => {
      if (purpose === 'payment-password') {
        updateProfile({ paymentPasswordSet: true })
        setPaymentPasswordDraft(null)
        navigateAccount({ screen: 'security' })
      } else {
        updateProfile({ antiPhishingCode: antiPhishingDraft })
        setAntiPhishingDraft(null)
        navigateAccount({ screen: 'security-anti-phishing' })
      }
      setLoading(false)
    }, 400)
  }

  function handleEnableVerification() {
    setShowVerificationSheet(false)
    navigateAccount({ screen: 'security-google-setup' })
  }

  return (
    <>
      <SubPageLayout title={accountCopy.securityVerifyTitle} onBack={handleBack}>
        <p className="mb-6 text-body-sm text-secondary">{meta.hint}</p>

        <form onSubmit={handleSubmit}>
          <OtpField
            label="Google 验证码"
            value={otp}
            onChange={setOtp}
            error={error}
          />
          <AuthButton type="submit" loading={loading}>
            {meta.submitLabel}
          </AuthButton>
        </form>
      </SubPageLayout>

      <AddVerificationMethodSheet
        open={showVerificationSheet}
        onClose={() => {
          setShowVerificationSheet(false)
          if (!user.googleAuthBound) handleBack()
        }}
        onEnable={handleEnableVerification}
        defaultMethod="authenticator"
      />
    </>
  )
}
