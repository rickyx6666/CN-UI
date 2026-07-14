import { useMemo, useState } from 'react'
import type { MarketPair } from '../../data/mock'
import { formatPrice, formatUsd } from '../../data/mock'
import { generateOrderBook } from '../../data/trade'
import { contractPairLabel } from '../../data/contract'
import { OrderBook } from '../trade/OrderBook'
import { AuthButton } from '../auth/AuthButton'

interface ContractTradePanelProps {
  pair: MarketPair
  isLoggedIn: boolean
  onLogin: () => void
}

export function ContractTradePanel({
  pair,
  isLoggedIn,
  onLogin,
}: ContractTradePanelProps) {
  const [side, setSide] = useState<'long' | 'short'>('long')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [leverage, setLeverage] = useState(20)
  const leverageOptions = [5, 10, 20, 50]
  const [amount, setAmount] = useState('')

  const { asks, bids } = useMemo(
    () => generateOrderBook(pair.price),
    [pair.price],
  )

  if (!isLoggedIn) {
    return (
      <div className="px-3 py-10 text-center">
        <p className="text-body-sm text-secondary">登录后开通合约交易</p>
        <div className="mt-4">
          <AuthButton onClick={onLogin}>登录</AuthButton>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 pb-3">
      <div className="mb-3 flex items-center justify-between rounded-lg border border-border-subtle bg-elevated px-3 py-2.5">
        <div>
          <p className="text-caption text-secondary">合约</p>
          <p className="text-body-sm font-medium text-primary">
            {contractPairLabel(pair)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const index = leverageOptions.indexOf(leverage)
            const next = leverageOptions[(index + 1) % leverageOptions.length]
            setLeverage(next)
          }}
          className="rounded-md bg-brand-muted px-2.5 py-1 text-caption font-semibold text-brand"
        >
          {leverage}x
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setSide('long')}
          className={`h-9 flex-1 rounded-md text-body-sm font-semibold ${
            side === 'long'
              ? 'bg-success text-white'
              : 'border border-border-subtle bg-elevated text-secondary'
          }`}
        >
          开多
        </button>
        <button
          type="button"
          onClick={() => setSide('short')}
          className={`h-9 flex-1 rounded-md text-body-sm font-semibold ${
            side === 'short'
              ? 'bg-danger text-white'
              : 'border border-border-subtle bg-elevated text-secondary'
          }`}
        >
          开空
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {(['market', 'limit'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setOrderType(type)}
            className={`rounded-md px-3 py-1.5 text-caption font-medium ${
              orderType === type
                ? 'bg-brand-muted text-brand'
                : 'text-secondary'
            }`}
          >
            {type === 'market' ? '市价' : '限价'}
          </button>
        ))}
        <span className="ml-auto self-center text-caption text-secondary">
          全仓
        </span>
      </div>

      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="rounded-lg border border-border-subtle bg-elevated p-3">
            <p className="text-caption text-secondary">数量 ({pair.base})</p>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 w-full bg-transparent text-body font-medium text-primary outline-none"
            />
            <p className="mt-2 text-caption text-secondary">
              可用保证金 <span className="text-primary">2,100 USDT</span>
            </p>
          </div>
          <AuthButton type="button">
            {side === 'long' ? '买入开多' : '卖出开空'}
          </AuthButton>
        </div>
        <OrderBook pair={pair} asks={asks} bids={bids} onPriceSelect={() => {}} />
      </div>

      <div className="mt-3 rounded-lg bg-sunken px-3 py-2 text-caption text-secondary">
        标记价格{' '}
        <span className="tabular-nums text-primary">{formatPrice(pair.price)}</span>
        {' · '}
        预估保证金{' '}
        <span className="tabular-nums text-primary">
          ${formatUsd(Number(amount || 0) * pair.price / leverage)}
        </span>
      </div>
    </div>
  )
}
