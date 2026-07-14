import { usePrototype } from '../../context/PrototypeContext'
import { fundingCoinBalances } from '../../data/assets'
import { formatBalance, formatUsd } from '../../data/mock'
import type { WalletCoin } from '../../data/wallet'
import { CoinAvatar } from '../CoinAvatar'

export function FundingAssetsPanel() {
  const { openWallet } = usePrototype()

  return (
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
            <div className="mt-1.5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  openWallet('deposit', { coin: coin.symbol as WalletCoin })
                }
                className="text-[10px] text-brand"
              >
                充币
              </button>
              <button
                type="button"
                onClick={() =>
                  openWallet('withdraw', { coin: coin.symbol as WalletCoin })
                }
                className="text-[10px] text-secondary"
              >
                提币
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
