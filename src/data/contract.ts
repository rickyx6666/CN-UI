import type { MarketPair } from './mock'
import { marketPairs } from './mock'
import { isContractPairId } from './productModule'

export interface ContractPortfolioSummary {
  equityUsd: number
  availableMarginUsd: number
  unrealizedPnlUsd: number
  marginRatioPercent: number
}

export interface ContractPosition {
  id: string
  symbol: string
  side: 'long' | 'short'
  leverage: number
  size: number
  entryPrice: number
  markPrice: number
  pnlUsd: number
  marginUsd: number
}

/** USDT 永续 · 取现货 Top 标的生成合约行情 */
export const contractPairs: MarketPair[] = marketPairs.slice(0, 16).map((pair) => ({
  ...pair,
  id: `perp-${pair.id}`,
  volume24h: pair.volume24h * 1.35,
}))

export const contractPortfolioSummary: ContractPortfolioSummary = {
  equityUsd: 4_820.5,
  availableMarginUsd: 2_100,
  unrealizedPnlUsd: 128.4,
  marginRatioPercent: 12.5,
}

export const contractPositions: ContractPosition[] = [
  {
    id: 'pos-btc-long',
    symbol: 'BTC',
    side: 'long',
    leverage: 20,
    size: 0.05,
    entryPrice: 67_500,
    markPrice: 67_842.5,
    pnlUsd: 17.12,
    marginUsd: 168.75,
  },
  {
    id: 'pos-eth-short',
    symbol: 'ETH',
    side: 'short',
    leverage: 10,
    size: 1.2,
    entryPrice: 3_480,
    markPrice: 3_456.12,
    pnlUsd: 28.66,
    marginUsd: 414.72,
  },
]

export function resolveContractPairId(pairId: string): string {
  if (isContractPairId(pairId)) return pairId
  return `perp-${pairId}`
}

export function contractPairLabel(pair: MarketPair): string {
  return `${pair.base}${pair.quote} 永续`
}
