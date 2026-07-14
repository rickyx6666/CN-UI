import { Check } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import { formatChangePercent, formatPrice } from '../../data/mock'
import { usePrototype } from '../../context/PrototypeContext'

interface FavoritesGridProps {
  pairs: MarketPair[]
  contractMode?: boolean
}

export function FavoritesGrid({ pairs, contractMode = false }: FavoritesGridProps) {
  const { openTrade, toggleFavorite, isFavorite } = usePrototype()

  if (pairs.length === 0) {
    return (
      <div className="px-3 py-16 text-center text-body-sm text-secondary">
        暂无自选，点击下方添加
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 px-3 py-3">
      {pairs.map((pair) => {
        const active = isFavorite(pair.id)
        const isPositive = pair.change24h >= 0

        return (
          <div
            key={pair.id}
            className="relative rounded-lg bg-elevated px-3 py-3"
          >
            <button
              type="button"
              onClick={() => openTrade(pair.id)}
              className="w-full text-left active:opacity-80"
            >
              <p className="text-body-sm font-semibold text-primary">
                {pair.base}
                <span className="font-normal text-secondary">/{pair.quote}</span>
              </p>
              <p className="mt-2 text-[10px] text-secondary">
                {contractMode ? '永续' : '现货'}
              </p>
              <p
                className={`mt-1 tabular-nums text-caption ${
                  isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {formatPrice(pair.price)} · {formatChangePercent(pair.change24h)}
              </p>
            </button>
            <button
              type="button"
              aria-label={active ? '取消自选' : '加入自选'}
              onClick={() => toggleFavorite(pair.id)}
              className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm ${
                active ? 'bg-brand text-brand-dark' : 'bg-sunken text-secondary'
              }`}
            >
              {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
            </button>
          </div>
        )
      })}
    </div>
  )
}
