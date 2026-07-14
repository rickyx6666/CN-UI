import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { TextField } from '../../components/auth/TextField'
import { authCopy, isValidAccount } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

export function RegisterPage() {
  const { closeAuth, openLogin, setAuthScreen, authScreen } = usePrototype()
  const [email, setEmail] = useState('')
  const [inviteCode, setInviteCode] = useState(authScreen?.inviteCode ?? '')
  const [showInviteCode, setShowInviteCode] = useState(Boolean(authScreen?.inviteCode))
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string>()
  const [termsError, setTermsError] = useState<string>()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true

    if (!isValidAccount(email)) {
      setEmailError(authCopy.accountInvalid)
      valid = false
    } else {
      setEmailError(undefined)
    }

    if (!agreed) {
      setTermsError('请阅读并同意相关协议')
      valid = false
    } else {
      setTermsError(undefined)
    }

    if (!valid) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setAuthScreen({
        screen: 'register-verify',
        email: email.trim(),
        inviteCode: inviteCode.trim().toUpperCase(),
      })
    }, 400)
  }

  return (
    <AuthPageShell title={authCopy.registerTitle} onBack={closeAuth}>
      <p className="mb-6 text-body-sm text-secondary">
        {authCopy.registerHint}
      </p>

      <form onSubmit={handleSubmit}>
        <TextField
          label={authCopy.accountLabel}
          type="text"
          value={email}
          onChange={setEmail}
          placeholder={authCopy.accountPlaceholder}
          error={emailError}
          autoComplete="username"
        />
        <button
          type="button"
          onClick={() => setShowInviteCode((v) => !v)}
          className="mb-3 flex items-center gap-1 text-body-sm text-secondary"
        >
          <span>邀请码（选填）</span>
          {showInviteCode ? (
            <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
        {showInviteCode && (
          <TextField
            label=""
            value={inviteCode}
            onChange={setInviteCode}
            placeholder="请输入邀请码"
            autoComplete="off"
          />
        )}

        <label className="mb-6 flex items-start gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border accent-brand"
          />
          <span className="text-body-sm text-secondary">{authCopy.termsLabel}</span>
        </label>
        {termsError && (
          <p className="-mt-4 mb-4 text-body-sm text-danger" role="alert">
            {termsError}
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          获取验证码
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-body-sm text-secondary">
        已有账户？{' '}
        <button
          type="button"
          onClick={openLogin}
          className="font-medium text-brand active:opacity-70"
        >
          去登录
        </button>
      </p>
    </AuthPageShell>
  )
}
