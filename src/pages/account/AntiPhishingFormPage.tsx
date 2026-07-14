import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AddVerificationMethodSheet } from '../../components/account/AddVerificationMethodSheet'
import { AntiPhishingCodeRules } from '../../components/account/AntiPhishingCodeRules'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { securityVerifyScreen } from '../../data/account'
import {
  antiPhishingCopy,
  isValidAntiPhishingCode,
} from '../../data/antiPhishing'
import { usePrototype } from '../../context/PrototypeContext'

export function AntiPhishingFormPage() {
  const {
    accountScreen,
    user,
    navigateAccount,
    setAntiPhishingDraft,
  } = usePrototype()
  const mode = accountScreen?.antiPhishingMode ?? 'create'
  const isChange = mode === 'change'
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [showVerificationSheet, setShowVerificationSheet] = useState(false)

  const title = isChange
    ? antiPhishingCopy.changeTitle
    : antiPhishingCopy.createTitle

  function handleBack() {
    navigateAccount({ screen: 'security-anti-phishing' })
  }

  function proceedToVerify() {
    setAntiPhishingDraft(code)
    navigateAccount(securityVerifyScreen('anti-phishing'))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidAntiPhishingCode(code)) {
      setError('请按规则输入有效的防钓鱼码')
      return
    }
    setError(undefined)

    if (!user.googleAuthBound) {
      setShowVerificationSheet(true)
      return
    }

    proceedToVerify()
  }

  function handleEnableVerification(method: 'passkey' | 'authenticator') {
    setShowVerificationSheet(false)
    setAntiPhishingDraft(code)

    if (method === 'authenticator') {
      navigateAccount({ screen: 'security-google-setup' })
    }
  }

  const canSubmit = isValidAntiPhishingCode(code)

  return (
    <>
      <SubPageLayout title={title} onBack={handleBack}>
      <p className="mb-5 text-body-sm text-secondary">
        {antiPhishingCopy.passwordNote}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block text-body-sm text-secondary">
            {antiPhishingCopy.title}
          </label>
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/[^A-Za-z0-9_]/g, '').slice(0, 8))
              setError(undefined)
            }}
            placeholder=""
            autoComplete="off"
            spellCheck={false}
            className={`h-12 w-full rounded-md border bg-sunken px-4 font-mono text-body text-primary outline-none transition-colors duration-200 ${
              error ? 'border-danger' : 'border-border focus:border-brand'
            }`}
          />
          {error && (
            <p className="mt-1 text-body-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>

        <AntiPhishingCodeRules code={code} />

        <div className="mt-6">
          <AuthButton type="submit" disabled={!canSubmit}>
            {antiPhishingCopy.submitButton}
          </AuthButton>
        </div>
      </form>
      </SubPageLayout>

      <AddVerificationMethodSheet
        open={showVerificationSheet}
        onClose={() => setShowVerificationSheet(false)}
        onEnable={handleEnableVerification}
        defaultMethod="authenticator"
      />
    </>
  )
}
