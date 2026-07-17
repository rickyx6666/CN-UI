import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { AuthSecurityTipBanner } from '../../components/auth/AuthSecurityTipBanner'
import { TextField } from '../../components/auth/TextField'
import { authCopy, isValidAccount } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

export function ForgotPasswordPage() {
  const { authScreen, setAuthScreen } = usePrototype()
  const returnScreen = authScreen?.returnScreen ?? 'login'
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidAccount(account)) {
      setError(authCopy.accountInvalid)
      return
    }
    setError(undefined)
    setLoading(true)

    window.setTimeout(() => {
      setLoading(false)
      setAuthScreen({
        screen: 'forgot-security-verify',
        email: account.trim(),
        flow: 'reset',
        returnScreen,
      })
    }, 400)
  }

  return (
    <AuthPageShell
      title={authCopy.forgotPasswordTitle}
      onBack={() => setAuthScreen({ screen: returnScreen })}
      footer={
        <p className="text-center text-body-sm text-secondary">
          <button
            type="button"
            onClick={() => setAuthScreen({ screen: returnScreen })}
            className="font-medium text-brand active:opacity-70"
          >
            返回登录
          </button>
        </p>
      }
    >
      <AuthSecurityTipBanner
        message={authCopy.resetPasswordWithdrawTip}
        className="mb-4"
      />

      <form onSubmit={handleSubmit}>
        <TextField
          label={authCopy.accountLabel}
          type="text"
          value={account}
          onChange={setAccount}
          placeholder={authCopy.accountPlaceholder}
          error={error}
          autoComplete="username"
        />

        <AuthButton type="submit" loading={loading}>
          下一步
        </AuthButton>
      </form>
    </AuthPageShell>
  )
}
