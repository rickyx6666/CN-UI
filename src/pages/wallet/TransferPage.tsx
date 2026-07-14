import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { AuthButton } from '../../components/auth/AuthButton'
import { TextField } from '../../components/auth/TextField'
import { CoinAvatar } from '../../components/CoinAvatar'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { usePrototype } from '../../context/PrototypeContext'
import { formatTradeAmount, getAvailableBalance } from '../../data/trade'
import {
  fundingBalances,
  transferAccountLabels,
  walletAssets,
  walletCopy,
  type TransferAccount,
  type WalletCoin,
} from '../../data/wallet'

export function TransferPage() {
  const {
    walletScreen,
    spotBalances,
    closeWallet,
    showToast,
  } = usePrototype()

  const [coin, setCoin] = useState<WalletCoin>(walletScreen?.coin ?? 'USDT')
  const [fromAccount, setFromAccount] = useState<TransferAccount>('funding')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const toAccount: TransferAccount = fromAccount === 'funding' ? 'spot' : 'funding'
  const available =
    fromAccount === 'spot'
      ? getAvailableBalance(spotBalances, coin)
      : fundingBalances[coin]
  const parsedAmount = Number(amount)

  const canSubmit = useMemo(
    () => parsedAmount > 0 && parsedAmount <= available,
    [parsedAmount, available],
  )

  function handleSwapAccounts() {
    setFromAccount((prev) => (prev === 'funding' ? 'spot' : 'funding'))
    setAmount('')
    setError(undefined)
  }

  function handleCoinChange(next: WalletCoin) {
    setCoin(next)
    setAmount('')
    setError(undefined)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!parsedAmount || parsedAmount <= 0) {
      setError('请输入有效数量')
      return
    }

    if (parsedAmount > available) {
      setError(`${coin} 可用余额不足`)
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      showToast(
        `已从${transferAccountLabels[fromAccount]}划转 ${formatTradeAmount(parsedAmount, coin)} ${coin} 至${transferAccountLabels[toAccount]}`,
        'success',
      )
      closeWallet()
    }, 500)
  }

  return (
    <SubPageLayout title={walletCopy.transferTitle} onBack={closeWallet}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-border-subtle bg-elevated p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-caption text-secondary">从</p>
              <p className="mt-0.5 text-body font-medium text-primary">
                {transferAccountLabels[fromAccount]}
              </p>
            </div>
            <button
              type="button"
              aria-label="切换划转方向"
              onClick={handleSwapAccounts}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-base text-brand active:bg-elevated"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-caption text-secondary">到</p>
              <p className="mt-0.5 text-body font-medium text-primary">
                {transferAccountLabels[toAccount]}
              </p>
            </div>
          </div>
        </div>

        {walletScreen?.coin == null && (
          <>
            <p className="text-caption text-secondary">币种</p>
            <div className="grid grid-cols-3 gap-2">
              {walletAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => handleCoinChange(asset.symbol)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 ${
                    coin === asset.symbol
                      ? 'border-brand bg-brand-muted'
                      : 'border-border-subtle bg-elevated'
                  }`}
                >
                  <CoinAvatar symbol={asset.symbol} size={28} />
                  <span className="text-caption font-medium text-primary">
                    {asset.symbol}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-caption text-secondary">数量</p>
            <p className="text-caption text-secondary">
              可用{' '}
              <span className="tabular-nums text-primary">
                {formatTradeAmount(available, coin)} {coin}
              </span>
            </p>
          </div>
          <TextField
            label=""
            value={amount}
            onChange={setAmount}
            placeholder={`请输入 ${coin} 数量`}
            error={error}
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
        </div>

        <p className="text-caption leading-relaxed text-secondary">
          资金账户用于充提，现货账户用于交易。划转即时到账，不收取手续费。
        </p>

        <AuthButton type="submit" loading={loading} disabled={!canSubmit}>
          确认划转
        </AuthButton>
      </form>
    </SubPageLayout>
  )
}
