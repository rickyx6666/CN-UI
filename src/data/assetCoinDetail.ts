import { marketPairs } from './marketPairs'
import type { MarketPair } from './mock'
import { fundingBalances, type WalletCoin } from './wallet'
import type { SpotBalance } from './trade'
import { formatTradeAmount } from './trade'

export type AssetCoinAccountType = 'funding' | 'spot'

export interface AssetCoinBalanceDetail {
  symbol: string
  available: number
  locked: number
}

const walletCoins = new Set<string>(['USDT', 'BNB', 'TRX'])

export function isWalletCoin(symbol: string): symbol is WalletCoin {
  return walletCoins.has(symbol)
}

export function getFundingCoinBalance(symbol: string): AssetCoinBalanceDetail {
  if (!isWalletCoin(symbol)) {
    return { symbol, available: 0, locked: 0 }
  }

  return {
    symbol,
    available: fundingBalances[symbol],
    locked: 0,
  }
}

export function getSpotCoinBalance(
  symbol: string,
  spotBalances: SpotBalance[],
): AssetCoinBalanceDetail {
  const balance = spotBalances.find((item) => item.symbol === symbol)
  return {
    symbol,
    available: balance?.available ?? 0,
    locked: balance?.frozen ?? 0,
  }
}

export function getSpotTradePair(symbol: string): MarketPair | undefined {
  if (symbol === 'USDT') return undefined
  return marketPairs.find((pair) => pair.base === symbol)
}

export function formatCoinDetailAmount(
  value: number,
  symbol: string,
): string {
  return formatTradeAmount(value, symbol)
}
