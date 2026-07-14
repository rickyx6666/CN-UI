import { ChevronDown, LineChart } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import { formatChangePercent } from '../../data/mock'

interface TradePairBarProps {
  pair: MarketPair
  subtitle?: string
  onSelectPair: () => void
  onOpenKline?: () => void
}

export function TradePairBar({
  pair,
  subtitle,
  onSelectPair,
  onOpenKline,
}: TradePairBarProps) {
  const isPositive = pair.change24h >= 0

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <button
        type="button"
        onClick={onSelectPair}
        className="flex items-center gap-1 active:opacity-70"
      >
        <span className="text-body font-semibold text-primary">
          {pair.base}/{pair.quote}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
        <span
          className={`ml-1 tabular-nums text-caption ${
            isPositive ? 'text-success' : 'text-danger'
          }`}
        >
          {formatChangePercent(pair.change24h)}
        </span>
        {subtitle && (
          <span className="ml-2 text-[10px] text-secondary">{subtitle}</span>
        )}
      </button>
      <button
        type="button"
        aria-label="K 线"
        onClick={onOpenKline}
        className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
      >
        <LineChart className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
