import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { OtpField } from '../../components/auth/OtpField'
import { securityVerifyScreen } from '../../data/account'
import { isValidPaymentPin } from '../../data/auth'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function PaymentPasswordPage() {
  const { user, navigateAccount, setPaymentPasswordDraft } = usePrototype()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{
    password?: string
    confirm?: string
  }>({})

  function handleBack() {
    navigateAccount({ screen: 'security' })
  }

  function handleSubmit(e: React.FormEvent) {
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
    navigateAccount(securityVerifyScreen('payment-password'))
  }

  return (
    <SubPageLayout
      title={user.paymentPasswordSet ? '修改支付密码' : '设置支付密码'}
      onBack={handleBack}
    >
      <p className="mb-5 text-body-sm text-secondary">
        支付密码用于提币、转账等资金操作，请与登录密码区分设置。
      </p>

      <form onSubmit={handleSubmit}>
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
    </SubPageLayout>
  )
}
