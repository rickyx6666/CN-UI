import { LineChart } from 'lucide-react'
import type { MarketPair } from '../data/mock'
import { formatChangePercent, formatPrice, formatVolume } from '../data/mock'
import { usePrototype } from '../context/PrototypeContext'
import { CoinAvatar } from './CoinAvatar'

interface MarketListItemProps {
  pair: MarketPair
  contractMode?: boolean
}

export function MarketListItem({ pair, contractMode = false }: MarketListItemProps) {
  const { openTrade, openKline } = usePrototype()
  const isPositive = pair.change24h >= 0

  return (
    <div className="layout-screen-x flex w-full items-center gap-1 py-2.5">
      <button
        type="button"
        onClick={() => openTrade(pair.id)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left active:opacity-80"
      >
        <CoinAvatar symbol={pair.symbol} size={28} />

        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-medium text-primary">
            {pair.symbol}
            <span className="text-secondary">/{pair.quote}</span>
            {contractMode && (
              <span className="ml-1 text-[10px] font-normal text-secondary">
                永续
              </span>
            )}
          </p>
          <p className="tabular-nums text-[10px] text-secondary">
            {formatVolume(pair.volume24h)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="tabular-nums text-body-sm text-primary">
            {formatPrice(pair.price)}
          </p>
          <p
            className={`tabular-nums text-caption ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            {formatChangePercent(pair.change24h)}
          </p>
        </div>
      </button>
      <button
        type="button"
        aria-label={`${pair.symbol} K 线`}
        onClick={() => openKline(pair.id)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-secondary active:bg-elevated"
      >
        <LineChart className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
