import { ChevronRight } from 'lucide-react'
import { CoinAvatar } from '../CoinAvatar'
import { coinBalances, formatBalance, formatUsd } from '../../data/mock'
import { getCoinFullName } from '../../data/assets'

interface SpotAssetsPanelProps {
  onCoinClick: (symbol: string) => void
}

export function SpotAssetsPanel({ onCoinClick }: SpotAssetsPanelProps) {
  return (
    <>
      <h2 className="mb-2 text-body-sm font-medium text-secondary">资产</h2>
      <ul className="divide-y divide-border-subtle">
        {coinBalances.map((coin) => (
          <li key={coin.id}>
            <button
              type="button"
              onClick={() => onCoinClick(coin.symbol)}
              className="flex w-full items-center justify-between py-3 text-left active:opacity-80"
            >
              <div className="flex items-center gap-3">
                <CoinAvatar symbol={coin.symbol} size={32} />
                <div>
                  <p className="text-body font-medium text-primary">
                    {coin.symbol}
                  </p>
                  <p className="text-caption text-secondary">
                    {getCoinFullName(coin.symbol)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="tabular-nums text-body text-primary">
                    {formatBalance(coin.balance, coin.symbol)}
                  </p>
                  <p className="tabular-nums text-caption text-secondary">
                    ${formatUsd(coin.usdValue)}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
