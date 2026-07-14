import { useMemo } from 'react'
import { usePrototype } from '../../context/PrototypeContext'
import {
  getFundingCoinBalance,
  isWalletCoin,
} from '../../data/assetCoinDetail'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { CoinAvatar } from '../../components/CoinAvatar'
import { CoinDetailBalanceCard } from '../../components/assets/CoinDetailBalanceCard'

interface FundingCoinDetailPageProps {
  symbol: string
  onBack: () => void
}

export function FundingCoinDetailPage({
  symbol,
  onBack,
}: FundingCoinDetailPageProps) {
  const { openWallet } = usePrototype()
  const balance = useMemo(() => getFundingCoinBalance(symbol), [symbol])
  const canTransact = isWalletCoin(symbol)

  return (
    <SubPageLayout
      title={
        <span className="inline-flex items-center justify-center gap-2">
          <CoinAvatar symbol={symbol} size={22} />
          {symbol}
        </span>
      }
      onBack={onBack}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            disabled={!canTransact}
            onClick={() =>
              openWallet('deposit', {
                coin: symbol as 'USDT' | 'BNB' | 'TRX',
              })
            }
            className="h-11 min-w-0 flex-1 rounded-md bg-brand text-body-sm font-semibold text-brand-dark active:bg-brand-hover disabled:opacity-40"
          >
            充币
          </button>
          <button
            type="button"
            disabled={!canTransact}
            onClick={() =>
              openWallet('withdraw', {
                coin: symbol as 'USDT' | 'BNB' | 'TRX',
              })
            }
            className="h-11 min-w-0 flex-1 rounded-md border border-border text-body-sm font-medium text-primary active:bg-elevated disabled:opacity-40"
          >
            提币
          </button>
        </div>
      }
    >
      <CoinDetailBalanceCard
        symbol={balance.symbol}
        available={balance.available}
        locked={balance.locked}
      />
    </SubPageLayout>
  )
}
