import { useState } from 'react'
import { AuthButton } from '../../components/auth/AuthButton'
import { TextField } from '../../components/auth/TextField'
import { isValidPassword } from '../../data/auth'
import { formatTradeAmount } from '../../data/trade'
import { walletCopy } from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function WithdrawVerifyPage() {
  const { withdrawDraft, navigateWallet, user } = usePrototype()
  const [paymentPassword, setPaymentPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  if (!withdrawDraft) return null

  function handleBack() {
    navigateWallet({
      screen: 'withdraw',
      coin: withdrawDraft!.coin,
      chain: withdrawDraft!.chain,
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!withdrawDraft) return
    if (!user.paymentPasswordSet) {
      setError('请先设置支付密码')
      return
    }
    if (!isValidPassword(paymentPassword)) {
      setError('请输入至少 8 位支付密码')
      return
    }
    setError(undefined)
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      navigateWallet({
        screen: 'withdraw-security-verify',
        coin: withdrawDraft.coin,
        chain: withdrawDraft.chain,
      })
    }, 500)
  }

  const { coin, chain, address, amount, fee, receive } = withdrawDraft

  return (
    <SubPageLayout title={walletCopy.withdrawVerifyTitle} onBack={handleBack}>
      <p className="mb-4 text-body-sm text-secondary">
        为确认本次提币，请输入支付密码完成资金验证。
      </p>
      <div className="mb-5 rounded-lg border border-border-subtle bg-sunken px-4 py-3 text-body-sm">
        <div className="flex justify-between py-1">
          <span className="text-secondary">币种</span>
          <span className="text-primary">
            {coin} · {chain}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">地址</span>
          <span className="max-w-[180px] truncate text-primary">{address}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">数量</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(amount, coin)} {coin}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">手续费</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(fee, coin)} {coin}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">到账</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(receive, coin)} {coin}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <TextField
          label="支付密码"
          type="password"
          value={paymentPassword}
          onChange={setPaymentPassword}
          placeholder="请输入支付密码"
          error={error}
          autoComplete="current-password"
        />
        <AuthButton type="submit" loading={loading}>
          确认提币
        </AuthButton>
      </form>
    </SubPageLayout>
  )
}
