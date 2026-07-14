import { useMemo } from 'react'
import { usePrototype } from '../../context/PrototypeContext'
import { formatChangePercent, formatPrice } from '../../data/mock'
import {
  getSpotCoinBalance,
  getSpotTradePair,
} from '../../data/assetCoinDetail'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { CoinAvatar } from '../../components/CoinAvatar'
import { CoinDetailBalanceCard } from '../../components/assets/CoinDetailBalanceCard'
import { CoinDetailEmptyState } from '../../components/assets/CoinDetailEmptyState'

interface SpotCoinDetailPageProps {
  symbol: string
  onBack: () => void
}

export function SpotCoinDetailPage({ symbol, onBack }: SpotCoinDetailPageProps) {
  const { spotBalances, openTrade, selectPair, setActiveTab, setProductModule } =
    usePrototype()
  const balance = useMemo(
    () => getSpotCoinBalance(symbol, spotBalances),
    [symbol, spotBalances],
  )
  const tradePair = useMemo(() => getSpotTradePair(symbol), [symbol])
  const isPositive = (tradePair?.change24h ?? 0) >= 0

  function handleTradeClick() {
    if (!tradePair) return
    setProductModule('spot')
    selectPair(tradePair.id)
    setActiveTab('trade')
    openTrade(tradePair.id)
  }

  return (
    <SubPageLayout
      title={
        <span className="inline-flex items-center justify-center gap-2">
          <CoinAvatar symbol={symbol} size={22} />
          {symbol}
        </span>
      }
      onBack={onBack}
    >
      <CoinDetailBalanceCard
        symbol={balance.symbol}
        available={balance.available}
        locked={balance.locked}
      />

      {tradePair ? (
        <section className="mt-6">
          <h2 className="mb-3 text-body-sm font-medium text-primary">去交易</h2>
          <button
            type="button"
            onClick={handleTradeClick}
            className="flex w-full items-center justify-between rounded-xl bg-elevated px-4 py-3 text-left active:opacity-90"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-body-sm font-medium text-primary">
                  {tradePair.base}
                  {tradePair.quote}
                </span>
                <span className="rounded bg-sunken px-1.5 py-0.5 text-[10px] text-secondary">
                  现货
                </span>
              </div>
              <p className="tabular-nums text-body font-medium text-primary">
                {formatPrice(tradePair.price)}
              </p>
            </div>
            <p
              className={`tabular-nums text-body-sm ${
                isPositive ? 'text-success' : 'text-danger'
              }`}
            >
              {isPositive ? '▲' : '▼'}{' '}
              {formatChangePercent(tradePair.change24h)}
            </p>
          </button>
        </section>
      ) : null}

      <section className="mt-6">
        <h2 className="mb-1 text-body-sm font-medium text-primary">历史记录</h2>
        <CoinDetailEmptyState />
      </section>
    </SubPageLayout>
  )
}
