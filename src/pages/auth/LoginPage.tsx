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

export function LoginPage() {
  const { closeAuth, openRegister, setAuthScreen } = usePrototype()
  const [mode, setMode] = useState<LoginMode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function validate() {
    const next: typeof errors = {}
    if (!isValidAccount(email)) next.email = authCopy.accountInvalid
    if (mode === 'password' && !isValidPassword(password)) {
      next.password = '密码至少 8 位'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (mode === 'code') {
        setAuthScreen({
          screen: 'login-verify',
          email: email.trim(),
          loginMethod: 'code',
        })
        return
      }
      setAuthScreen({
        screen: 'login-verify',
        email: email.trim(),
        loginMethod: 'password',
      })
    }, 400)
  }

  return (
    <AuthPageShell title={authCopy.loginTitle} onBack={closeAuth}>
      <div className="mb-6 flex border-b border-border-subtle">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`relative flex-1 pb-2.5 text-body-sm font-medium ${
            mode === 'password' ? 'text-primary' : 'text-secondary'
          }`}
        >
          密码登录
          {mode === 'password' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setMode('code')}
          className={`relative flex-1 pb-2.5 text-body-sm font-medium ${
            mode === 'code' ? 'text-primary' : 'text-secondary'
          }`}
        >
          验证码登录
          {mode === 'code' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
          )}
        </button>
      </div>

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

        {mode === 'password' && (
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

        {mode === 'password' && (
          <p className="mb-4 text-body-sm text-secondary">
            验证通过后将向邮箱发送二次验证码
          </p>
        )}

        {mode === 'code' && (
          <p className="mb-4 text-body-sm text-secondary">
            我们将向您的邮箱发送 6 位验证码
          </p>
        )}

        <AuthButton type="submit" loading={loading}>
          {mode === 'password' ? '下一步' : '获取验证码'}
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-body-sm text-secondary">
        还没有账户？{' '}
        <button
          type="button"
          onClick={openRegister}
          className="font-medium text-brand active:opacity-70"
        >
          立即注册
        </button>
      </p>
    </AuthPageShell>
  )
}
