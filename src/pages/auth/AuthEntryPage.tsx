import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { TextField } from '../../components/auth/TextField'
import {
  authCopy,
  isValidAccount,
  isValidPassword,
  type LoginMode,
} from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

type EntryTab = 'login' | 'register'

export function AuthEntryPage() {
  const { closeAuth, setAuthScreen } = usePrototype()
  const [tab, setTab] = useState<EntryTab>('login')
  const [loginMode, setLoginMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    terms?: string
  }>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}

    if (!isValidAccount(email)) next.email = authCopy.accountInvalid

    if (tab === 'login') {
      if (loginMode === 'password' && !isValidPassword(password)) {
        next.password = '密码至少 8 位'
      }
    } else if (!agreed) {
      next.terms = '请阅读并同意相关协议'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      const trimmed = email.trim()

      if (tab === 'register') {
        setAuthScreen({
          screen: 'register-verify',
          email: trimmed,
          inviteCode: inviteCode.trim().toUpperCase(),
        })
        return
      }

      setAuthScreen({
        screen: 'login-verify',
        email: trimmed,
        loginMethod: loginMode,
      })
    }, 400)
  }

  return (
    <AuthPageShell title="注册 / 登录" onBack={closeAuth}>
      <div className="mb-6 flex border-b border-border-subtle">
        <button
          type="button"
          onClick={() => {
            setTab('login')
            setErrors({})
          }}
          className={`relative flex-1 pb-2.5 text-body-sm font-medium ${
            tab === 'login' ? 'text-primary' : 'text-secondary'
          }`}
        >
          登录
          {tab === 'login' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('register')
            setErrors({})
          }}
          className={`relative flex-1 pb-2.5 text-body-sm font-medium ${
            tab === 'register' ? 'text-primary' : 'text-secondary'
          }`}
        >
          注册
          {tab === 'register' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
      </div>

      {tab === 'login' && (
        <div className="mb-5 flex gap-2">
          {(['password', 'code'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLoginMode(mode)}
              className={`rounded-full px-3 py-1.5 text-caption font-medium ${
                loginMode === mode
                  ? 'bg-brand-muted text-brand'
                  : 'bg-sunken text-secondary'
              }`}
            >
              {mode === 'password' ? '密码登录' : '验证码登录'}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label={authCopy.accountLabel}
          type="text"
          value={email}
          onChange={setEmail}
          placeholder={authCopy.accountPlaceholder}
          error={errors.email}
          autoComplete="username"
        />

        {tab === 'login' && loginMode === 'password' && (
          <TextField
            label="密码"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="请输入密码"
            error={errors.password}
            autoComplete="current-password"
          />
        )}

        {tab === 'login' && loginMode === 'password' && (
          <p className="mb-4 text-body-sm text-secondary">
            验证通过后将向邮箱发送二次验证码
          </p>
        )}

        {tab === 'login' && loginMode === 'code' && (
          <p className="mb-4 text-body-sm text-secondary">
            我们将向您的邮箱发送 6 位验证码
          </p>
        )}

        {tab === 'register' && (
          <>
            <p className="mb-4 text-body-sm text-secondary">
              {authCopy.registerHint}
            </p>
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
              <span className="text-body-sm text-secondary">
                {authCopy.termsLabel}
              </span>
            </label>
            {errors.terms && (
              <p className="-mt-4 mb-4 text-body-sm text-danger" role="alert">
                {errors.terms}
              </p>
            )}
          </>
        )}

        <AuthButton type="submit" loading={loading}>
          {tab === 'register'
            ? '获取验证码'
            : loginMode === 'password'
              ? '下一步'
              : '获取验证码'}
        </AuthButton>
      </form>
    </AuthPageShell>
  )
}
