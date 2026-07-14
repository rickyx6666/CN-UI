import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Plus, RefreshCw } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import {
  calcOrderTotal,
  formatTradeAmount,
  getAmountDecimals,
  getAvailableBalance,
  tradeCopy,
  validateOrderInput,
  type OrderSide,
  type OrderType,
  type SpotBalance,
} from '../../data/trade'
import type { WalletCoin } from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'

interface OrderFormProps {
  pair: MarketPair
  balances: SpotBalance[]
  onSubmit: (input: {
    side: OrderSide
    type: OrderType
    price: number
    amount: number
    total: number
    fee: number
  }) => void
  onLogin: () => void
  isLoggedIn: boolean
  selectedPrice?: number | null
}

const percentMarks = [0, 25, 50, 75, 100] as const

const depositCoinMap: Record<string, WalletCoin> = {
  USDT: 'USDT',
  BNB: 'BNB',
  TRX: 'TRX',
}

export function OrderForm({
  pair,
  balances,
  onSubmit,
  onLogin,
  isLoggedIn,
  selectedPrice,
}: OrderFormProps) {
  const { openWallet } = usePrototype()
  const [side, setSide] = useState<OrderSide>('buy')
  const [orderType, setOrderType] = useState<OrderType>('limit')
  const [price, setPrice] = useState(String(pair.price))
  const [amount, setAmount] = useState('')
  const [totalInput, setTotalInput] = useState('')
  const [percent, setPercent] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPrice(String(pair.price))
    setAmount('')
    setTotalInput('')
    setPercent(null)
    setError(null)
  }, [pair.id, pair.price])

  useEffect(() => {
    if (selectedPrice != null) {
      setPrice(String(selectedPrice))
      setOrderType('limit')
    }
  }, [selectedPrice])

  const parsedPrice = Number(price)
  const parsedAmount = Number(amount)
  const effectivePrice = orderType === 'market' ? pair.price : parsedPrice

  const { total, fee } = useMemo(() => {
    if (!parsedAmount || parsedAmount <= 0) {
      return { total: 0, fee: 0 }
    }
    return calcOrderTotal(effectivePrice, parsedAmount, side)
  }, [effectivePrice, parsedAmount, side])

  const availableSymbol = side === 'buy' ? pair.quote : pair.base
  const available = getAvailableBalance(balances, availableSymbol)
  const isBuy = side === 'buy'

  function syncTotalFromAmount(nextAmount: string) {
    setAmount(nextAmount)
    const qty = Number(nextAmount)
    if (qty > 0 && effectivePrice > 0) {
      setTotalInput((qty * effectivePrice).toFixed(2))
    } else {
      setTotalInput('')
    }
  }

  function syncAmountFromTotal(nextTotal: string) {
    setTotalInput(nextTotal)
    const gross = Number(nextTotal)
    if (gross > 0 && effectivePrice > 0) {
      setAmount((gross / effectivePrice).toFixed(getAmountDecimals(pair.base)))
    } else {
      setAmount('')
    }
  }

  function applyPercent(mark: number) {
    setPercent(mark)
    const ratio = mark / 100

    if (side === 'buy') {
      const budget = available * ratio
      const unitPrice = orderType === 'market' ? pair.price : parsedPrice
      if (unitPrice > 0) {
        const nextAmount = budget / (unitPrice * 1.001)
        syncTotalFromAmount(
          nextAmount > 0 ? nextAmount.toFixed(getAmountDecimals(pair.base)) : '',
        )
      }
    } else {
      const nextAmount = available * ratio
      syncTotalFromAmount(
        nextAmount > 0 ? nextAmount.toFixed(getAmountDecimals(pair.base)) : '',
      )
    }
  }

  function handleSubmit() {
    if (!isLoggedIn) {
      onLogin()
      return
    }

    const validationError = validateOrderInput({
      side,
      type: orderType,
      price: effectivePrice,
      amount: parsedAmount,
      pair,
      balances,
    })

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onSubmit({
      side,
      type: orderType,
      price: effectivePrice,
      amount: parsedAmount,
      total,
      fee,
    })
  }

  function handleAddAssets() {
    if (!isLoggedIn) {
      onLogin()
      return
    }
    const coin = depositCoinMap[availableSymbol] ?? 'USDT'
    openWallet('deposit', { coin })
  }

  return (
    <div className="min-w-0 w-full">
      <div className="mb-2 grid grid-cols-2 overflow-hidden rounded-md">
        <button
          type="button"
          onClick={() => {
            setSide('buy')
            setError(null)
          }}
          className={`py-2 text-caption font-semibold ${
            isBuy ? 'bg-success text-white' : 'bg-sunken text-secondary'
          }`}
        >
          {tradeCopy.buy}
        </button>
        <button
          type="button"
          onClick={() => {
            setSide('sell')
            setError(null)
          }}
          className={`py-2 text-caption font-semibold ${
            !isBuy ? 'bg-danger text-white' : 'bg-sunken text-secondary'
          }`}
        >
          {tradeCopy.sell}
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          setOrderType((t) => (t === 'limit' ? 'market' : 'limit'))
        }
        className="mb-2 flex h-8 w-full items-center justify-between rounded-md bg-sunken px-2.5 text-caption text-primary"
      >
        <span>{orderType === 'limit' ? tradeCopy.limit : tradeCopy.market}</span>
        <ChevronDown className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
      </button>

      <Field
        label="价格"
        unit={pair.quote}
        value={orderType === 'market' ? '市价' : price}
        onChange={setPrice}
        disabled={orderType === 'market'}
      />
      <Field
        label="数量"
        unit={pair.base}
        value={amount}
        onChange={(v) => {
          setPercent(null)
          syncTotalFromAmount(v)
        }}
        placeholder=""
      />
      <Field
        label="金额"
        unit={pair.quote}
        value={totalInput}
        onChange={(v) => {
          setPercent(null)
          syncAmountFromTotal(v)
        }}
        placeholder=""
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
                className={`h-2.5 w-2.5 rounded-full border ${
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
          {isLoggedIn
            ? `${formatTradeAmount(available, availableSymbol)} ${availableSymbol}`
            : '—'}
          {isLoggedIn && (
            <button
              type="button"
              aria-label="充币"
              onClick={handleAddAssets}
              className="flex h-4 w-4 items-center justify-center rounded border border-border text-secondary active:bg-elevated"
            >
              <Plus className="h-2.5 w-2.5" strokeWidth={2} />
            </button>
          )}
        </span>
      </div>

      {error && (
        <p className="mb-1.5 text-[10px] text-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className={`h-10 w-full rounded-md text-body-sm font-semibold active:opacity-90 ${
          isLoggedIn
            ? `${isBuy ? 'bg-success' : 'bg-danger'} text-white`
            : 'bg-brand text-brand-dark'
        }`}
      >
        {isLoggedIn ? `${isBuy ? tradeCopy.buy : tradeCopy.sell} ${pair.base}` : '登录'}
      </button>
    </div>
  )
}

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string
  unit: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="mb-1.5 block">
      <div className="flex h-8 items-center rounded-md bg-sunken px-2.5">
        <span className="w-8 shrink-0 text-[10px] text-secondary">{label}</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent tabular-nums text-caption text-primary outline-none placeholder:text-primary-muted disabled:text-secondary"
        />
        <span className="shrink-0 text-[10px] text-secondary">{unit}</span>
      </div>
    </label>
  )
}
