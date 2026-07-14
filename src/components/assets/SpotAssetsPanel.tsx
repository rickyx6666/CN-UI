import { CoinAvatar } from '../CoinAvatar'
import { coinBalances, formatBalance, formatUsd } from '../../data/mock'

export function SpotAssetsPanel() {
  return (
    <>
      <h2 className="mb-2 text-body-sm font-medium text-secondary">资产</h2>
      <ul className="divide-y divide-border-subtle">
        {coinBalances.map((coin) => (
          <li
            key={coin.id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <CoinAvatar symbol={coin.symbol} size={32} />
              <div>
                <p className="text-body font-medium text-primary">
                  {coin.symbol}
                </p>
                <p className="text-caption text-secondary">{coin.chain}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="tabular-nums text-body text-primary">
                {formatBalance(coin.balance, coin.symbol)}
              </p>
              <p className="tabular-nums text-caption text-secondary">
                ${formatUsd(coin.usdValue)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
