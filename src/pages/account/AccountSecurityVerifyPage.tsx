import { SubPageLayout } from '../../components/account/SubPageLayout'
import { MultiFactorSecurityVerifyForm } from '../../components/security/MultiFactorSecurityVerifyForm'
import {
  accountCopy,
  getSecurityVerifyMeta,
} from '../../data/account'
import { getSecurityVerifyConfig } from '../../data/securityVerify'
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

  if (!purpose) return null

  const meta = getSecurityVerifyMeta(purpose, user)

  function handleBack() {
    navigateAccount(meta.backScreen())
  }

  function handleSuccess() {
    if (purpose === 'payment-password' && !paymentPasswordDraft) {
      navigateAccount({ screen: 'security-payment-password' })
      return
    }

    if (purpose === 'anti-phishing' && !antiPhishingDraft) {
      navigateAccount({ screen: 'security-anti-phishing' })
      return
    }

    if (purpose === 'payment-password') {
      updateProfile({ paymentPasswordSet: true })
      setPaymentPasswordDraft(null)
      navigateAccount({ screen: 'security' })
      return
    }

    updateProfile({ antiPhishingCode: antiPhishingDraft })
    setAntiPhishingDraft(null)
    navigateAccount({ screen: 'security-anti-phishing' })
  }

  return (
    <SubPageLayout title={accountCopy.securityVerifyTitle} onBack={handleBack}>
      <MultiFactorSecurityVerifyForm
        config={{
          ...getSecurityVerifyConfig('google-email'),
          hint: meta.hint,
          submitLabel: meta.submitLabel,
        }}
        onSuccess={handleSuccess}
        onRequireGoogleSetup={() =>
          navigateAccount({ screen: 'security-google-setup' })
        }
      />
    </SubPageLayout>
  )
}
