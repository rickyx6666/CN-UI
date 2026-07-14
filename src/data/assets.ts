import { contractPortfolioSummary } from './contract'
import { coinBalances, formatUsd } from './mock'
import { fundingBalances, walletAssets, type WalletCoin } from './wallet'

export type AssetAccountId = 'funding' | 'spot' | 'contract'

export interface AssetAccountSummary {
  id: AssetAccountId
  label: string
  balanceUsd: number
}

const walletUsdRate: Record<WalletCoin, number> = {
  USDT: 1,
  BNB: 612.3,
  TRX: 0.1106,
}

function fundingBalanceUsd(): number {
  return (Object.keys(fundingBalances) as WalletCoin[]).reduce(
    (sum, coin) => sum + fundingBalances[coin] * walletUsdRate[coin],
    0,
  )
}

function spotBalanceUsd(): number {
  return coinBalances.reduce((sum, coin) => sum + coin.usdValue, 0)
}

export const assetAccountSummaries: AssetAccountSummary[] = [
  { id: 'funding', label: '资金', balanceUsd: fundingBalanceUsd() },
  { id: 'spot', label: '现货', balanceUsd: spotBalanceUsd() },
  {
    id: 'contract',
    label: '合约',
    balanceUsd: contractPortfolioSummary.equityUsd,
  },
]

export const assetAccountLabels: Record<AssetAccountId, string> = {
  funding: '资金账户',
  spot: '现货账户',
  contract: '合约账户',
}

/** 原型：USD → CNY 估算 */
export function approximateCny(usd: number): string {
  return `≈ ¥${formatUsd(usd * 6.78)}`
}

export function fundingCoinBalances() {
  return walletAssets.map((asset) => {
    const balance = fundingBalances[asset.symbol]
    const usdValue = balance * walletUsdRate[asset.symbol]
    return {
      id: asset.id,
      symbol: asset.symbol,
      balance,
      usdValue,
    }
  })
}
