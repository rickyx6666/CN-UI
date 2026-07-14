import { contractPortfolioSummary } from './contract'
import { coinBalances, formatUsd } from './mock'
import { fundingBalances, walletAssets, type WalletCoin } from './wallet'

export type AssetAccountId = 'funding' | 'spot' | 'contract'

export type AssetPageTabId = 'overview' | AssetAccountId

export interface AssetAccountSummary {
  id: AssetAccountId
  label: string
  balanceUsd: number
}

export interface AssetPageTab {
  id: AssetPageTabId
  label: string
}

const walletUsdRate: Record<WalletCoin, number> = {
  USDT: 1,
  BNB: 612.3,
  TRX: 0.1106,
}

export function fundingBalanceUsd(): number {
  return (Object.keys(fundingBalances) as WalletCoin[]).reduce(
    (sum, coin) => sum + fundingBalances[coin] * walletUsdRate[coin],
    0,
  )
}

export function spotBalanceUsd(): number {
  return coinBalances.reduce((sum, coin) => sum + coin.usdValue, 0)
}

export function getAccountBalanceUsd(accountId: AssetAccountId): number {
  switch (accountId) {
    case 'funding':
      return fundingBalanceUsd()
    case 'spot':
      return spotBalanceUsd()
    case 'contract':
      return contractPortfolioSummary.equityUsd
  }
}

export const assetAccountPnl: Record<
  AssetAccountId,
  { usd: number; percent: number }
> = {
  funding: { usd: 12.5, percent: 0.21 },
  spot: { usd: 122.23, percent: 0.52 },
  contract: { usd: -15.2, percent: -0.08 },
}

export const assetPageTabs: AssetPageTab[] = [
  { id: 'overview', label: '总览' },
  { id: 'funding', label: '资金' },
  { id: 'spot', label: '现货' },
  { id: 'contract', label: '合约' },
]

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
  const sign = usd < 0 ? '−' : ''
  return `≈ ${sign}¥${formatUsd(Math.abs(usd) * 6.78)}`
}

/** 资金账户列表：币种下方展示链网络 */
export const fundingCoinChainLabels: Record<WalletCoin, string> = {
  USDT: 'BSC / TRC20',
  BNB: 'BSC',
  TRX: 'TRC20',
}

/** 现货账户列表：币种下方展示全称 */
export const coinFullNames: Record<string, string> = {
  USDT: 'Tether',
  BNB: 'BNB',
  TRX: 'TRON',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
}

export function getCoinFullName(symbol: string): string {
  return coinFullNames[symbol] ?? symbol
}

export function fundingCoinBalances() {
  return walletAssets.map((asset) => {
    const balance = fundingBalances[asset.symbol]
    const usdValue = balance * walletUsdRate[asset.symbol]
    return {
      id: asset.id,
      symbol: asset.symbol,
      chainLabel: fundingCoinChainLabels[asset.symbol],
      balance,
      usdValue,
    }
  })
}
