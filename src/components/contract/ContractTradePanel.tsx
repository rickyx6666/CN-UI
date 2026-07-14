import { useMemo, useState } from 'react'
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

export function ContractTradePanel({
  pair,
  isLoggedIn,
  onLogin,
}: ContractTradePanelProps) {
  const [positionMode, setPositionMode] = useState<ContractPositionMode>('open')
  const [orderKind, setOrderKind] = useState<ContractOrderKind>('conditional')
  const [leverage, setLeverage] = useState(5)
  const [triggerPrice, setTriggerPrice] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [percent, setPercent] = useState<number | null>(null)
  const [tpSlEnabled, setTpSlEnabled] = useState(false)

  const available = isLoggedIn ? contractPortfolioSummary.availableMarginUsd : 0
  const parsedAmount = Number(amount) || 0
  const marginPerSide = useMemo(() => {
    if (!parsedAmount || !pair.price) return 0
    return (parsedAmount * pair.price) / leverage
  }, [parsedAmount, pair.price, leverage])

  const maxOpen = useMemo(() => {
    if (!pair.price || !available) return 0
    return (available * leverage) / pair.price
  }, [available, leverage, pair.price])

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
    const nextAmount = ((available * leverage * ratio) / pair.price).toFixed(4)
    setAmount(nextAmount === '0.0000' ? '' : nextAmount)
  }

  function adjustAmount(delta: number) {
    const step = pair.base === 'BTC' ? 0.001 : 0.01
    const current = Number(amount) || 0
    const next = Math.max(0, current + delta * step)
    setAmount(next > 0 ? next.toFixed(4) : '')
    setPercent(null)
  }

  function handleTrade(side: 'long' | 'short') {
    if (!isLoggedIn) {
      onLogin()
    }
  }

  const orderKindLabel =
    contractOrderKinds.find((item) => item.id === orderKind)?.label ?? '条件委托'

  return (
    <div className="min-w-0 flex-[1.15]">
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

      <div className="mb-2 grid grid-cols-3 gap-1.5">
        <ChipButton label="全仓" />
        <ChipButton label={`${leverage}x`} onClick={cycleLeverage} />
        <ChipButton label="单" />
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

      {orderKind === 'conditional' && (
        <StepperField
          label="触发价"
          unit={pair.quote}
          value={triggerPrice}
          onChange={setTriggerPrice}
          suffix="最新"
        />
      )}
      <StepperField
        label="委托价"
        unit={pair.quote}
        value={limitPrice}
        onChange={setLimitPrice}
        suffix="限价"
        onMinus={() => setLimitPrice(String(Math.max(0, (Number(limitPrice) || pair.price) - 1)))}
        onPlus={() => setLimitPrice(String((Number(limitPrice) || pair.price) + 1))}
      />
      <StepperField
        label="数量"
        unit={pair.base}
        value={amount}
        onChange={(v) => {
          setAmount(v)
          setPercent(null)
        }}
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
        <span className="tabular-nums text-primary">
          {formatTradeAmount(available, 'USDT')} USDT
        </span>
      </div>

      <label className="mb-2 flex items-center gap-2 text-[10px] text-secondary">
        <input
          type="checkbox"
          checked={tpSlEnabled}
          onChange={(e) => setTpSlEnabled(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-border accent-brand"
        />
        止盈/止损
      </label>

      <div className="grid grid-cols-2 gap-2">
        <TradeSideCard
          side="long"
          maxOpen={maxOpen}
          margin={marginPerSide}
          base={pair.base}
          onClick={() => handleTrade('long')}
        />
        <TradeSideCard
          side="short"
          maxOpen={maxOpen}
          margin={marginPerSide}
          base={pair.base}
          onClick={() => handleTrade('short')}
        />
      </div>
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
  unit,
  value,
  onChange,
  suffix,
  onMinus,
  onPlus,
}: {
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  onMinus?: () => void
  onPlus?: () => void
}) {
  return (
    <label className="mb-1.5 block">
      <div className="flex h-8 items-center rounded-md bg-sunken px-1">
        <button
          type="button"
          onClick={onMinus}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-secondary active:opacity-70"
        >
          <Minus className="h-3 w-3" strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1 px-1">
          <p className="text-[9px] leading-none text-secondary">{label}</p>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent text-caption tabular-nums text-primary outline-none placeholder:text-primary-muted"
          />
        </div>
        <span className="shrink-0 pr-1 text-[10px] text-secondary">{unit}</span>
        {suffix && (
          <span className="shrink-0 rounded bg-elevated px-1.5 py-0.5 text-[9px] text-secondary">
            {suffix}
          </span>
        )}
        <button
          type="button"
          onClick={onPlus}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-secondary active:opacity-70"
        >
          <Plus className="h-3 w-3" strokeWidth={2} />
        </button>
      </div>
    </label>
  )
}

function TradeSideCard({
  side,
  maxOpen,
  margin,
  base,
  onClick,
}: {
  side: 'long' | 'short'
  maxOpen: number
  margin: number
  base: string
  onClick: () => void
}) {
  const isLong = side === 'long'

  return (
    <div className="min-w-0">
      <div className="mb-1 space-y-0.5 text-[9px] text-secondary">
        <div className="flex justify-between gap-1">
          <span>可开</span>
          <span className="tabular-nums text-primary">
            {formatTradeAmount(maxOpen, base)} {base}
          </span>
        </div>
        <div className="flex justify-between gap-1">
          <span>保证金</span>
          <span className="tabular-nums text-primary">
            {formatUsd(margin)} USDT
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-md py-2.5 text-center active:opacity-90 ${
          isLong ? 'bg-success text-white' : 'bg-danger text-white'
        }`}
      >
        <span className="block text-caption font-semibold">
          {isLong ? '开多' : '开空'}
        </span>
        <span className="block text-[9px] opacity-90">
          {isLong ? '看涨' : '看跌'}
        </span>
      </button>
    </div>
  )
}
