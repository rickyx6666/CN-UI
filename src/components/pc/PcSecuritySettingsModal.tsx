import { useState } from 'react'
import type { PcSecuritySettingsScreen } from './pcAccountModalScreens'
import { usePrototype } from '../../context/PrototypeContext'
import { AuthButton } from '../auth/AuthButton'
import { OtpField } from '../auth/OtpField'
import { TextField } from '../auth/TextField'
import { isValidOtp, isValidPassword, isValidPaymentPin } from '../../data/auth'
import { PcModalShell } from './PcModalShell'

interface PcSecuritySettingsModalProps {
  screen: PcSecuritySettingsScreen
  onClose: () => void
}

export function PcSecuritySettingsModal({ screen, onClose }: PcSecuritySettingsModalProps) {
  switch (screen) {
    case 'security-email':
      return <PcEmailModal onClose={onClose} />
    case 'security-login-password':
      return <PcLoginPasswordModal onClose={onClose} />
    case 'security-payment-password':
      return <PcPaymentPasswordModal onClose={onClose} />
  }
}

function PcEmailModal({ onClose }: { onClose: () => void }) {
  const { user } = usePrototype()

  return (
    <PcModalShell title="邮箱" onClose={onClose} maxWidth="max-w-md">
      <div className="rounded-xl border border-border-subtle bg-sunken px-4 py-4">
        <p className="text-caption text-secondary">当前绑定邮箱</p>
        <p className="mt-1 text-body font-medium text-primary">{user.email}</p>
        <p className="mt-3 text-body-sm leading-relaxed text-secondary">
          邮箱用于登录、找回密码及安全验证，修改需通过原邮箱验证。
        </p>
      </div>

      <button
        type="button"
        className="mt-5 h-11 w-full rounded-md border border-border text-body-sm font-medium text-primary hover:bg-sunken"
      >
        修改邮箱
      </button>

      <p className="mt-4 text-center text-caption text-primary-muted">
        原型提示：修改邮箱流程一期仅展示入口
      </p>
    </PcModalShell>
  )
}

function PcLoginPasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    current?: string
    next?: string
    confirm?: string
  }>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (!isValidPassword(current)) {
      nextErrors.current = '请输入当前密码'
    }
    if (!isValidPassword(next)) {
      nextErrors.next = '新密码至少 8 位'
    }
    if (next !== confirm) {
      nextErrors.confirm = '两次输入的密码不一致'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      onClose()
    }, 400)
  }

  return (
    <PcModalShell title="修改登录密码" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit}>
        <TextField
          label="当前密码"
          type="password"
          value={current}
          onChange={setCurrent}
          error={errors.current}
          autoComplete="current-password"
        />
        <TextField
          label="新密码"
          type="password"
          value={next}
          onChange={setNext}
          error={errors.next}
          autoComplete="new-password"
        />
        <TextField
          label="确认新密码"
          type="password"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          autoComplete="new-password"
        />
        <AuthButton type="submit" loading={loading}>
          确认修改
        </AuthButton>
      </form>
    </PcModalShell>
  )
}

function PcPaymentPasswordModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, setPaymentPasswordDraft } = usePrototype()
  const [step, setStep] = useState<'pin' | 'verify'>('pin')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirm?: string
    otp?: string
  }>({})

  const title =
    step === 'verify'
      ? '安全验证'
      : user.paymentPasswordSet
        ? '修改支付密码'
        : '设置支付密码'

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (!isValidPaymentPin(password)) {
      nextErrors.password = '请输入 6 位支付密码'
    }
    if (password !== confirm) {
      nextErrors.confirm = '两次输入的密码不一致'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPaymentPasswordDraft(password)
    setStep('verify')
    setErrors({})
  }

  function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidOtp(otp)) {
      setErrors({ otp: '请输入 6 位 Google 验证码' })
      return
    }

    setErrors({})
    setLoading(true)
    window.setTimeout(() => {
      updateProfile({ paymentPasswordSet: true })
      setPaymentPasswordDraft(null)
      setLoading(false)
      onClose()
    }, 400)
  }

  return (
    <PcModalShell title={title} onClose={onClose} maxWidth="max-w-md">
      {step === 'pin' ? (
        <>
          <p className="mb-4 text-body-sm text-secondary">
            支付密码用于提币、转账等资金操作，请与登录密码区分设置。
          </p>

          <form onSubmit={handlePinSubmit}>
            <OtpField
              label="支付密码"
              value={password}
              onChange={setPassword}
              error={errors.password}
              masked
              autoComplete="new-password"
              ariaLabel="输入 6 位支付密码"
            />
            <OtpField
              label="确认支付密码"
              value={confirm}
              onChange={setConfirm}
              error={errors.confirm}
              masked
              autoComplete="new-password"
              ariaLabel="再次输入 6 位支付密码"
            />
            <AuthButton type="submit">
              {user.paymentPasswordSet ? '确认修改' : '确认设置'}
            </AuthButton>
          </form>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setStep('pin')
              setOtp('')
              setErrors({})
            }}
            className="mb-4 text-body-sm text-brand"
          >
            返回上一步
          </button>
          <p className="mb-4 text-body-sm text-secondary">
            请输入验证器 App 生成的 6 位数验证码，以
            {user.paymentPasswordSet ? '修改' : '设置'}支付密码。
          </p>

          <form onSubmit={handleVerifySubmit}>
            <OtpField
              label="Google 验证码"
              value={otp}
              onChange={setOtp}
              error={errors.otp}
            />
            <AuthButton type="submit" loading={loading}>
              {user.paymentPasswordSet ? '确认修改' : '确认设置'}
            </AuthButton>
          </form>
        </>
      )}
    </PcModalShell>
  )
}
