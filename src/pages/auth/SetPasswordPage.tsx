import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthPageShell } from '../../components/auth/AuthPageShell'
import { TextField } from '../../components/auth/TextField'
import { authCopy, isValidPassword } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'

interface SetPasswordPageProps {
  email: string
  inviteCode?: string
  mode?: 'register' | 'reset'
  returnScreen?: 'entry' | 'login'
}

export function SetPasswordPage({
  email,
  inviteCode,
  mode = 'register',
  returnScreen = 'login',
}: SetPasswordPageProps) {
  const { setAuthScreen, showToast } = usePrototype()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}

    if (!isValidPassword(password)) {
      next.password = '密码至少 8 位'
    }
    if (password !== confirm) {
      next.confirm = '两次输入的密码不一致'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      if (mode === 'reset') {
        showToast(authCopy.resetPasswordSuccess)
        setAuthScreen({ screen: returnScreen })
        return
      }
      setAuthScreen({
        screen: 'security-verify',
        email,
        inviteCode,
        flow: 'register',
      })
    }, 400)
  }

  const title = mode === 'reset' ? authCopy.resetPasswordTitle : authCopy.passwordTitle

  function handleBack() {
    if (mode === 'reset') {
      setAuthScreen({
        screen: 'forgot-security-verify',
        email,
        flow: 'reset',
        returnScreen,
      })
      return
    }
    setAuthScreen({ screen: 'register-verify', email, inviteCode })
  }

  return (
    <AuthPageShell title={title} onBack={handleBack}>
      <p className="mb-6 text-body-sm text-secondary">
        {mode === 'reset'
          ? authCopy.resetPasswordHint(email)
          : <>为 <span className="text-primary">{email}</span> 设置登录密码</>}
      </p>
      {inviteCode && (
        <p className="-mt-3 mb-6 text-caption text-brand">邀请码：{inviteCode}</p>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="密码"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="至少 8 位"
          error={errors.password}
          autoComplete="new-password"
        />
        <TextField
          label="确认密码"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="再次输入密码"
          error={errors.confirm}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading}>
          {mode === 'reset' ? '确认重置' : '完成注册'}
        </AuthButton>
      </form>
    </AuthPageShell>
  )
}
