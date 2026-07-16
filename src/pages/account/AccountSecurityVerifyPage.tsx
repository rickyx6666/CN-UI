import { SubPageLayout } from '../../components/account/SubPageLayout'
import { MultiFactorSecurityVerifyForm } from '../../components/security/MultiFactorSecurityVerifyForm'
import {
  accountCopy,
  getSecurityVerifyMeta,
  type SecurityVerifyPurpose,
} from '../../data/account'
import {
  getSecurityVerifyConfig,
  type SecurityVerifyScenario,
} from '../../data/securityVerify'
import { usePrototype } from '../../context/PrototypeContext'

function getSecurityVerifyScenario(purpose: SecurityVerifyPurpose): SecurityVerifyScenario {
  if (purpose === 'google-unbind') return 'google-contact'
  return 'google-email'
}

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
  const scenario = getSecurityVerifyScenario(purpose)

  function handleBack() {
    navigateAccount(meta.backScreen())
  }

  function handleSuccess() {
    if (purpose === 'google-unbind') {
      updateProfile({ googleAuthBound: false, googleAuthBoundAt: null })
      navigateAccount({ screen: 'security-google' })
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
          ...getSecurityVerifyConfig(scenario),
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
