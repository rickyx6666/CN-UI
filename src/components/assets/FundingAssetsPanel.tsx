import { fundingCoinBalances } from '../../data/assets'
import { formatBalance, formatUsd } from '../../data/mock'
import { CoinAvatar } from '../CoinAvatar'

export function FundingAssetsPanel() {
  return (
    <>
      <h2 className="mb-2 text-body-sm font-medium text-secondary">资产</h2>
      <ul className="divide-y divide-border-subtle">
        {fundingCoinBalances().map((coin) => (
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
                <p className="text-caption text-secondary">资金账户</p>
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
