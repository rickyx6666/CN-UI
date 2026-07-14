import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Minus, Plus, RefreshCw } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import { formatUsd } from '../../data/mock'
import {
  contractLeverageOptions,
  contractOrderKinds,
  contractPortfolioSummary,
  type ContractOrderKind,
  type ContractPositionMode,
} from '../../data/contract'
import { formatTradeAmount } from '../../data/trade'

interface ContractTradePanelProps {
  pair: MarketPair
  isLoggedIn: boolean
  onLogin: () => void
}

const percentMarks = [0, 25, 50, 75, 100] as const
const timeInForceOptions = ['GTC', 'IOC', 'FOK'] as const

export function ContractTradePanel({
  pair,
  isLoggedIn,
  onLogin,
}: ContractTradePanelProps) {
  const [positionMode, setPositionMode] = useState<ContractPositionMode>('open')
  const [orderKind, setOrderKind] = useState<ContractOrderKind>('limit')
  const [leverage, setLeverage] = useState(19)
  const [price, setPrice] = useState(String(pair.price))
  const [amount, setAmount] = useState('')
  const [percent, setPercent] = useState<number | null>(null)
  const [tpSlEnabled, setTpSlEnabled] = useState(false)
  const [timeInForce, setTimeInForce] =
    useState<(typeof timeInForceOptions)[number]>('GTC')

  useEffect(() => {
    setPrice(String(pair.price))
    setAmount('')
    setPercent(null)
  }, [pair.id, pair.price])

  const available = isLoggedIn ? contractPortfolioSummary.availableMarginUsd : 0
  const parsedAmount = Number(amount) || 0
  const marginPerSide = useMemo(() => {
    if (!parsedAmount || !pair.price) return 0
    return (parsedAmount * pair.price) / leverage
  }, [parsedAmount, pair.price, leverage])

  const maxOpenLong = useMemo(() => {
    if (!pair.price || !available) return 0
    return (available * leverage) / pair.price
  }, [available, leverage, pair.price])

  const maxOpenShort = maxOpenLong * 0.998

  function cycleLeverage() {
    const index = contractLeverageOptions.indexOf(
      leverage as (typeof contractLeverageOptions)[number],
    )
    const next =
      contractLeverageOptions[(index + 1) % contractLeverageOptions.length]
    setLeverage(next)
  }

  function applyPercent(mark: number) {
    setPercent(mark)
    if (!available || !pair.price) {
      setAmount('')
      return
    }
    const ratio = mark / 100
    const nextAmount = ((available * leverage * ratio) / pair.price).toFixed(3)
    setAmount(nextAmount === '0.000' ? '' : nextAmount)
  }

  function adjustAmount(delta: number) {
    const step = pair.base === 'BTC' ? 0.001 : 0.01
    const current = Number(amount) || 0
    const next = Math.max(0, current + delta * step)
    setAmount(next > 0 ? next.toFixed(3) : '')
    setPercent(null)
  }

  function adjustPrice(delta: number) {
    const step = pair.base === 'BTC' ? 0.1 : 0.01
    const current = Number(price) || pair.price
    setPrice(String(Math.max(0, current + delta * step)))
  }

  function handleTrade(_side: 'long' | 'short') {
    if (!isLoggedIn) onLogin()
  }

  const orderKindLabel =
    contractOrderKinds.find((item) => item.id === orderKind)?.label ?? '限价单'

  return (
    <div className="min-w-0 w-full">
      <div className="mb-2 grid grid-cols-2 overflow-hidden rounded-md bg-sunken">
        {(
          [
            { id: 'open' as const, label: '开仓' },
            { id: 'close' as const, label: '平仓' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPositionMode(item.id)}
            className={`py-2 text-caption font-semibold ${
              positionMode === item.id
                ? 'bg-elevated text-primary shadow-sm'
                : 'text-secondary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <ChipButton label="全仓" />
        <ChipButton label={`${leverage}x`} onClick={cycleLeverage} />
      </div>

      <button
        type="button"
        onClick={() => {
          const index = contractOrderKinds.findIndex((item) => item.id === orderKind)
          const next = contractOrderKinds[(index + 1) % contractOrderKinds.length]
          setOrderKind(next.id)
        }}
        className="mb-2 flex h-8 w-full items-center justify-between rounded-md bg-sunken px-2.5 text-caption text-primary"
      >
        <span>{orderKindLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
      </button>

      <StepperField
        label={`价格 (${pair.quote})`}
        value={price}
        onChange={setPrice}
        suffix="最优价"
        onMinus={() => adjustPrice(-1)}
        onPlus={() => adjustPrice(1)}
      />
      <StepperField
        label={`数量 (${pair.base})`}
        value={amount}
        onChange={(v) => {
          setAmount(v)
          setPercent(null)
        }}
        suffix={pair.base}
        showSuffixDropdown
        onMinus={() => adjustAmount(-1)}
        onPlus={() => adjustAmount(1)}
      />

      <div className="relative mb-2 mt-1 h-1 rounded-full bg-border">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-brand/60"
          style={{ width: `${percent ?? 0}%` }}
        />
        <div className="absolute inset-x-0 -top-1 flex justify-between">
          {percentMarks.map((mark) => (
            <button
              key={mark}
              type="button"
              onClick={() => applyPercent(mark)}
              className="flex flex-col items-center"
            >
              <span
                className={`h-2.5 w-2.5 rotate-45 border ${
                  (percent ?? 0) >= mark
                    ? 'border-brand bg-brand'
                    : 'border-border bg-base'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-[10px] text-secondary">
        <span className="flex items-center gap-1">
          可用
          <RefreshCw className="h-3 w-3" strokeWidth={1.5} />
        </span>
        <span className="flex items-center gap-1 tabular-nums text-primary">
          {formatTradeAmount(available, 'USDT')} USDT
          <button
            type="button"
            aria-label="划转"
            className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-brand-dark"
          >
            <Plus className="h-2.5 w-2.5" strokeWidth={2.5} />
          </button>
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-[10px] text-secondary">
          <input
            type="checkbox"
            checked={tpSlEnabled}
            onChange={(e) => setTpSlEnabled(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-border accent-brand"
          />
          止盈/止损
        </label>
        <button
          type="button"
          onClick={() => {
            const index = timeInForceOptions.indexOf(timeInForce)
            const next = timeInForceOptions[(index + 1) % timeInForceOptions.length]
            setTimeInForce(next)
          }}
          className="flex items-center gap-1 text-[10px] text-secondary"
        >
          {timeInForce}
          <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-1.5">
        <TradeActionBlock
          side="long"
          positionMode={positionMode}
          maxOpen={maxOpenLong}
          margin={marginPerSide}
          base={pair.base}
          onClick={() => handleTrade('long')}
        />
        <TradeActionBlock
          side="short"
          positionMode={positionMode}
          maxOpen={maxOpenShort}
          margin={marginPerSide}
          base={pair.base}
          onClick={() => handleTrade('short')}
        />
      </div>
    </div>
  )
}

function TradeActionBlock({
  side,
  positionMode,
  maxOpen,
  margin,
  base,
  onClick,
}: {
  side: 'long' | 'short'
  positionMode: ContractPositionMode
  maxOpen: number
  margin: number
  base: string
  onClick: () => void
}) {
  const isLong = side === 'long'
  const openLabel = isLong ? '开多' : '开空'
  const closeLabel = isLong ? '平多' : '平空'
  const biasLabel = isLong ? '看涨' : '看跌'

  return (
    <div>
      <div className="mb-1 space-y-0.5 text-[10px] text-secondary">
        <div className="flex items-center justify-between">
          <span>可开</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(maxOpen, base)} {base}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>保证金</span>
          <span className="tabular-nums text-primary">
            {formatUsd(margin)} USDT
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 active:opacity-90 ${
          isLong ? 'bg-success text-white' : 'bg-danger text-white'
        }`}
      >
        <span className="text-caption font-semibold">
          {positionMode === 'open' ? openLabel : closeLabel}
        </span>
        <span className="text-[10px] opacity-90">{biasLabel}</span>
      </button>
    </div>
  )
}

function ChipButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-sunken px-2 py-1.5 text-[10px] font-medium text-primary active:opacity-80"
    >
      {label}
    </button>
  )
}

function StepperField({
  label,
  value,
  onChange,
  suffix,
  showSuffixDropdown,
  onMinus,
  onPlus,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  showSuffixDropdown?: boolean
  onMinus?: () => void
  onPlus?: () => void
}) {
  return (
    <label className="mb-1.5 block">
      <div className="grid h-9 grid-cols-[24px_minmax(0,1fr)_24px_48px] items-center rounded-md bg-sunken px-1">
        <button
          type="button"
          onClick={onMinus}
          className="flex h-6 w-6 items-center justify-center text-secondary active:opacity-70"
        >
          <Minus className="h-3 w-3" strokeWidth={2} />
        </button>
        <div className="min-w-0 px-1">
          <p className="truncate text-[9px] leading-none text-secondary">{label}</p>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            className="w-full truncate bg-transparent text-caption tabular-nums text-primary outline-none placeholder:text-primary-muted"
          />
        </div>
        <button
          type="button"
          onClick={onPlus}
          className="flex h-6 w-6 items-center justify-center text-secondary active:opacity-70"
        >
          <Plus className="h-3 w-3" strokeWidth={2} />
        </button>
        {suffix ? (
          <span
            className={`justify-self-end text-[10px] text-secondary ${
              showSuffixDropdown ? 'flex items-center gap-0.5' : ''
            }`}
          >
            {suffix}
            {showSuffixDropdown && (
              <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
            )}
          </span>
        ) : null}
      </div>
    </label>
  )
}
