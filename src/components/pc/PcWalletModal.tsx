import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { FundRecord } from '../../data/records'
import { AuthButton } from '../auth/AuthButton'
import { TextField } from '../auth/TextField'
import { KycStatusBanner } from '../account/KycStatusBanner'
import { CoinAvatar } from '../CoinAvatar'
import { PcModalShell } from './PcModalShell'
import { PcDepositPanel } from '../../pages/pc/PcDepositPage'
import { isValidPassword } from '../../data/auth'
import { formatTradeAmount, getAvailableBalance } from '../../data/trade'
import {
  calcWithdrawReceive,
  getWithdrawChainsForCoin,
  walletAssets,
  walletCopy,
  withdrawFees,
  type WalletCoin,
  type WalletNetwork,
  type WalletScreenState,
} from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import type { PcWalletModalScreen } from './pcOverlayScreens'
import { WithdrawSecurityVerifyForm } from '../wallet/WithdrawSecurityVerifyForm'

interface PcWalletModalProps {
  screen: PcWalletModalScreen
  onClose: () => void
  onNavigate: (screen: WalletScreenState) => void
}

export function PcWalletModal({ screen, onClose, onNavigate }: PcWalletModalProps) {
  if (
    screen === 'deposit' ||
    screen === 'deposit-fetching' ||
    screen === 'deposit-address'
  ) {
    return (
      <PcModalShell
        title={walletCopy.depositTitle}
        onClose={onClose}
        maxWidth="max-w-3xl"
        scrollable
      >
        <PcDepositPanel />
      </PcModalShell>
    )
  }

  if (screen === 'withdraw') {
    return (
      <PcModalShell
        title={walletCopy.withdrawTitle}
        onClose={onClose}
        maxWidth="max-w-3xl"
        scrollable
      >
        <PcWithdrawPanel onClose={onClose} onNavigate={onNavigate} />
      </PcModalShell>
    )
  }

  if (screen === 'withdraw-verify') {
    return <PcWithdrawVerifyModal onClose={onClose} onNavigate={onNavigate} />
  }

  if (screen === 'withdraw-security-verify') {
    return <PcWithdrawSecurityVerifyModal onClose={onClose} onNavigate={onNavigate} />
  }

  return (
    <PcModalShell title={walletCopy.withdrawSuccessTitle} onClose={onClose} maxWidth="max-w-md">
      <PcWithdrawSuccessPanel onClose={onClose} />
    </PcModalShell>
  )
}

function PcWithdrawVerifyModal({
  onClose,
  onNavigate,
}: {
  onClose: () => void
  onNavigate: (screen: WalletScreenState) => void
}) {
  const { withdrawDraft } = usePrototype()

  function handleBack() {
    if (!withdrawDraft) {
      onClose()
      return
    }
    onNavigate({
      screen: 'withdraw',
      coin: withdrawDraft.coin,
      chain: withdrawDraft.chain,
    })
  }

  return (
    <PcModalShell
      title={walletCopy.withdrawVerifyTitle}
      onClose={handleBack}
      maxWidth="max-w-md"
    >
      <PcWithdrawVerifyPanel onNavigate={onNavigate} />
    </PcModalShell>
  )
}

function PcWithdrawPanel({
  onClose,
  onNavigate,
}: {
  onClose: () => void
  onNavigate: (screen: WalletScreenState) => void
}) {
  const {
    user,
    walletScreen,
    spotBalances,
    setWithdrawDraft,
    navigateAccount,
    openFundHistory,
    showToast,
  } = usePrototype()

  const [coin, setCoin] = useState<WalletCoin>(walletScreen?.coin ?? 'USDT')
  const chains = getWithdrawChainsForCoin(coin)
  const [chain, setChain] = useState<WalletNetwork>(walletScreen?.chain ?? chains[0])
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const available = getAvailableBalance(spotBalances, coin)
  const parsedAmount = Number(amount)
  const { fee, receive } = useMemo(
    () =>
      parsedAmount > 0
        ? calcWithdrawReceive(parsedAmount, coin)
        : { fee: withdrawFees[coin], receive: 0 },
    [parsedAmount, coin],
  )

  function handleCoinChange(next: WalletCoin) {
    setCoin(next)
    setChain(getWithdrawChainsForCoin(next)[0])
    setAmount('')
    setError(undefined)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (user.kycStatus !== 'verified') {
      setError('请先完成身份认证后再提币')
      return
    }

    if (!user.paymentPasswordSet) {
      setError('请先设置支付密码后再提币')
      onClose()
      navigateAccount({ screen: 'security-payment-password' })
      showToast('请先设置支付密码', 'warning')
      return
    }

    if (!address.trim()) {
      setError('请输入提币地址')
      return
    }

    if (!parsedAmount || parsedAmount <= 0) {
      setError('请输入有效数量')
      return
    }

    if (parsedAmount > available) {
      setError(`${coin} 可用余额不足`)
      return
    }

    if (receive <= 0) {
      setError('提币数量需大于手续费')
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setWithdrawDraft({
        coin,
        chain,
        address: address.trim(),
        amount: parsedAmount,
        fee,
        receive,
      })
      onNavigate({ screen: 'withdraw-verify', coin, chain })
    }, 300)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <section>
        <KycStatusBanner status={user.kycStatus} scene="withdraw" className="mb-5" />

        {!user.paymentPasswordSet && (
          <div className="mb-5 rounded-xl border border-brand/30 bg-brand/10 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-body-sm font-medium text-primary">未设置支付密码</p>
                <p className="mt-1 text-caption leading-6 text-secondary">
                  提币前需先完成支付密码设置。
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigateAccount({ screen: 'security-payment-password' })
                }}
                className="shrink-0 rounded-lg bg-brand px-4 py-2 text-body-sm font-semibold text-brand-dark hover:bg-brand-hover"
              >
                前往设置
              </button>
            </div>
          </div>
        )}

        <p className="mb-3 text-body-sm font-medium text-primary">选择币种</p>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {walletAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => handleCoinChange(asset.symbol)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-left ${
                coin === asset.symbol
                  ? 'border-brand bg-brand-muted'
                  : 'border-border-subtle bg-sunken'
              }`}
            >
              <CoinAvatar symbol={asset.symbol} size={28} />
              <span className="text-body-sm font-medium text-primary">{asset.symbol}</span>
            </button>
          ))}
        </div>

        <p className="mb-3 text-body-sm font-medium text-primary">提币网络</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {chains.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setChain(item)}
              className={`rounded-full px-4 py-2 text-caption font-medium ${
                chain === item ? 'bg-brand text-brand-dark' : 'bg-sunken text-secondary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <TextField
            label="提币地址"
            value={address}
            onChange={setAddress}
            placeholder="请输入或粘贴提币地址"
          />
          <TextField
            label="数量"
            value={amount}
            onChange={(v) => {
              setAmount(v)
              setError(undefined)
            }}
            placeholder="0"
            suffix={
              <button
                type="button"
                onClick={() => setAmount(String(available))}
                className="text-caption font-medium text-brand"
              >
                全部
              </button>
            }
          />
          {error && (
            <p className="mb-3 text-body-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <AuthButton type="submit" loading={loading}>
            提币
          </AuthButton>
        </form>
      </section>

      <aside className="rounded-xl border border-border-subtle bg-sunken p-4">
        <h3 className="text-body-sm font-semibold text-primary">提币概览</h3>
        <div className="mt-3 space-y-2 text-body-sm">
          <SummaryRow
            label="可用余额"
            value={`${formatTradeAmount(available, coin)} ${coin}`}
            tone="brand"
          />
          <SummaryRow
            label="网络手续费"
            value={`${formatTradeAmount(fee, coin)} ${coin}`}
          />
          <SummaryRow
            label="预计到账"
            value={receive > 0 ? `${formatTradeAmount(receive, coin)} ${coin}` : '—'}
          />
          <SummaryRow label="提币网络" value={chain} />
        </div>
        <button
          type="button"
          onClick={() => {
            onClose()
            openFundHistory()
          }}
          className="mt-4 w-full rounded-lg border border-border-subtle px-3 py-2 text-caption text-secondary hover:bg-elevated hover:text-primary"
        >
          查看充提记录
        </button>
      </aside>
    </div>
  )
}

function PcWithdrawSecurityVerifyModal({
  onClose,
  onNavigate,
}: {
  onClose: () => void
  onNavigate: (screen: WalletScreenState) => void
}) {
  const { withdrawDraft, navigateAccount } = usePrototype()

  function handleBack() {
    if (!withdrawDraft) {
      onClose()
      return
    }
    onNavigate({
      screen: 'withdraw-verify',
      coin: withdrawDraft.coin,
      chain: withdrawDraft.chain,
    })
  }

  return (
    <PcModalShell
      title={walletCopy.withdrawVerifyTitle}
      onClose={handleBack}
      maxWidth="max-w-md"
    >
      <WithdrawSecurityVerifyForm
        onSuccess={() => {
          if (!withdrawDraft) return
          onNavigate({
            screen: 'withdraw-success',
            coin: withdrawDraft.coin,
            chain: withdrawDraft.chain,
          })
        }}
        onRequireGoogleSetup={() => {
          onClose()
          navigateAccount({ screen: 'security-google-setup' })
        }}
      />
    </PcModalShell>
  )
}

function PcWithdrawVerifyPanel({
  onNavigate,
}: {
  onNavigate: (screen: WalletScreenState) => void
}) {
  const { withdrawDraft, user } = usePrototype()
  const [paymentPassword, setPaymentPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  if (!withdrawDraft) return null

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
      onNavigate({
        screen: 'withdraw-security-verify',
        coin: withdrawDraft.coin,
        chain: withdrawDraft.chain,
      })
    }, 500)
  }

  const { coin, chain, address, amount, fee, receive } = withdrawDraft

  return (
    <>
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
          <span className="max-w-[200px] truncate text-primary">{address}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">数量</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(amount, coin)} {coin}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">到账</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(receive, coin)} {coin}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-secondary">手续费</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(fee, coin)} {coin}
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
    </>
  )
}

function PcWithdrawSuccessPanel({ onClose }: { onClose: () => void }) {
  const { withdrawDraft, addFundRecord } = usePrototype()
  const recorded = useRef(false)

  useEffect(() => {
    if (!withdrawDraft || recorded.current) return
    recorded.current = true

    const record: FundRecord = {
      id: `fund-${Date.now()}`,
      type: 'withdraw',
      coin: withdrawDraft.coin,
      chain: withdrawDraft.chain,
      amount: withdrawDraft.amount,
      fee: withdrawDraft.fee,
      status: 'pending',
      address: withdrawDraft.address,
      txHash: '—',
      createdAt: Date.now(),
    }
    addFundRecord(record)
  }, [withdrawDraft, addFundRecord])

  if (!withdrawDraft) return null

  return (
    <>
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-success" strokeWidth={1.5} />
        <p className="mt-4 text-h3 font-semibold text-primary">提币处理中</p>
        <p className="mt-2 text-body-sm text-secondary">
          {formatTradeAmount(withdrawDraft.receive, withdrawDraft.coin)}{' '}
          {withdrawDraft.coin} 将在网络确认后到账，可在充提记录中查看状态。
        </p>
      </div>
      <AuthButton onClick={onClose}>完成</AuthButton>
    </>
  )
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'brand'
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-2 last:border-b-0">
      <span className="text-caption text-secondary">{label}</span>
      <span
        className={`text-right text-body-sm ${tone === 'brand' ? 'text-brand' : 'text-primary'}`}
      >
        {value}
      </span>
    </div>
  )
}
