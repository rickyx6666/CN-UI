import { ChevronDown, LineChart, MoreHorizontal } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import { formatChangePercent } from '../../data/mock'
import { contractFundingRate, contractPairLabel } from '../../data/contract'

interface ContractPairBarProps {
  pair: MarketPair
  onSelectPair: () => void
  onOpenKline?: () => void
}

export function ContractPairBar({
  pair,
  onSelectPair,
  onOpenKline,
}: ContractPairBarProps) {
  const isPositive = pair.change24h >= 0
  const funding = contractFundingRate(pair)

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      <button
        type="button"
        onClick={onSelectPair}
        className="min-w-0 text-left active:opacity-70"
      >
        <div className="flex items-center gap-1">
          <span className="text-body font-semibold text-primary">
            {contractPairLabel(pair)}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[10px]">
          <span
            className={`tabular-nums ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            {formatChangePercent(pair.change24h)}
          </span>
          <span className="tabular-nums text-secondary">
            {funding.ratePercent} / {funding.countdown}
          </span>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label="K 线"
          onClick={onOpenKline}
          className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
        >
          <LineChart className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="更多"
          className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
