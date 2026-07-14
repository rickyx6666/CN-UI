import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { OrderBookLevel, OrderBookDepth } from '../../data/trade'
import {
  formatOrderBookPrice,
  formatTradeAmount,
  orderBookDepthOptions,
  tradeCopy,
} from '../../data/trade'
import type { MarketPair } from '../../data/mock'
import { formatPrice } from '../../data/mock'
import { usePrototype } from '../../context/PrototypeContext'
import { BottomSheet, SheetOption } from '../sheets/BottomSheet'

interface OrderBookProps {
  pair: MarketPair
  asks: OrderBookLevel[]
  bids: OrderBookLevel[]
  onPriceSelect?: (price: number) => void
  showDepthRatio?: boolean
  compact?: boolean
}

function DepthBar({
  width,
  tone,
}: {
  width: number
  tone: 'ask' | 'bid'
}) {
  return (
    <span
      className={`absolute inset-y-0 right-0 ${
        tone === 'ask' ? 'bg-danger/12' : 'bg-success/12'
      }`}
      style={{ width: `${width}%` }}
    />
  )
}

export function OrderBook({
  pair,
  asks,
  bids,
  onPriceSelect,
  showDepthRatio = false,
  compact = false,
}: OrderBookProps) {
  const { figmaTradeOverlay } = usePrototype()
  const [depth, setDepth] = useState<OrderBookDepth>(
    showDepthRatio ? '0.1' : '0.0001',
  )
  const [depthSheetOpen, setDepthSheetOpen] = useState(
    figmaTradeOverlay === 'order-book-depth',
  )

  const maxAmount = Math.max(
    ...asks.map((l) => l.amount),
    ...bids.map((l) => l.amount),
  )
  const isPositive = pair.change24h >= 0
  const bidTotal = bids.reduce((sum, level) => sum + level.amount, 0)
  const askTotal = asks.reduce((sum, level) => sum + level.amount, 0)
  const depthTotal = bidTotal + askTotal
  const bidRatio = depthTotal > 0 ? (bidTotal / depthTotal) * 100 : 50
  const askRatio = 100 - bidRatio

  function formatLevelPrice(price: number) {
    return formatOrderBookPrice(price, depth)
  }

  return (
    <div className={`flex min-w-0 w-full flex-col ${compact ? '' : 'flex-1'}`}>
      <div className="mb-1 flex justify-between text-[9px] text-secondary">
        <span>价格({pair.quote})</span>
        <span>数量({pair.base})</span>
      </div>

      <div className="space-y-px">
        {asks.map((level) => (
          <button
            key={`ask-${level.price}`}
            type="button"
            onClick={() => onPriceSelect?.(level.price)}
            className="relative flex w-full items-center justify-between py-px text-left active:opacity-80"
          >
            <DepthBar width={(level.amount / maxAmount) * 100} tone="ask" />
            <span className="relative z-10 min-w-0 truncate tabular-nums text-[10px] text-danger">
              {formatLevelPrice(level.price)}
            </span>
            <span className="relative z-10 min-w-0 truncate tabular-nums text-[10px] text-secondary">
              {formatTradeAmount(level.amount, pair.base)}
            </span>
          </button>
        ))}
      </div>

      <div className={compact ? 'py-0.5 text-center' : 'py-1 text-center'}>
        <p
          className={`tabular-nums text-body-sm font-semibold ${
            showDepthRatio || isPositive ? 'text-success' : 'text-danger'
          }`}
        >
          {showDepthRatio
            ? formatOrderBookPrice(pair.price, '0.1')
            : formatPrice(pair.price)}
        </p>
        <p className="tabular-nums text-[9px] text-secondary">
          {showDepthRatio
            ? formatOrderBookPrice(pair.price - pair.price * 0.000002, '0.1')
            : `≈¥${(pair.price * 6.9).toFixed(2)}`}
        </p>
      </div>

      <div className="space-y-px">
        {bids.map((level) => (
          <button
            key={`bid-${level.price}`}
            type="button"
            onClick={() => onPriceSelect?.(level.price)}
            className="relative flex w-full items-center justify-between py-px text-left active:opacity-80"
          >
            <DepthBar width={(level.amount / maxAmount) * 100} tone="bid" />
            <span className="relative z-10 min-w-0 truncate tabular-nums text-[10px] text-success">
              {formatLevelPrice(level.price)}
            </span>
            <span className="relative z-10 min-w-0 truncate tabular-nums text-[10px] text-secondary">
              {formatTradeAmount(level.amount, pair.base)}
            </span>
          </button>
        ))}
      </div>

      {showDepthRatio && (
        <div className="mb-1.5">
          <div className="flex h-1 overflow-hidden rounded-full">
            <span
              className="bg-success/70"
              style={{ width: `${bidRatio}%` }}
            />
            <span
              className="bg-danger/70"
              style={{ width: `${askRatio}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] tabular-nums">
            <span className="text-success">{bidRatio.toFixed(2)}%</span>
            <span className="text-danger">{askRatio.toFixed(2)}%</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setDepthSheetOpen(true)}
        className="relative mt-1.5 flex h-7 w-full items-center justify-center rounded-md bg-sunken px-2 text-[10px] text-primary active:opacity-80"
      >
        <span className="tabular-nums font-medium">{depth}</span>
        <ChevronDown
          className="absolute right-2 h-3.5 w-3.5 text-secondary"
          strokeWidth={1.5}
        />
      </button>

      <BottomSheet
        title={tradeCopy.orderBookDepthTitle}
        open={depthSheetOpen}
        onClose={() => setDepthSheetOpen(false)}
      >
        <div className="space-y-2">
          {orderBookDepthOptions.map((option) => (
            <SheetOption
              key={option}
              label={option}
              selected={depth === option}
              onClick={() => {
                setDepth(option)
                setDepthSheetOpen(false)
              }}
            />
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
