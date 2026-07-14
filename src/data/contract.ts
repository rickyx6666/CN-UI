import type { MarketPair } from './mock'
import { marketPairs } from './mock'
import { isContractPairId } from './productModule'

export type ContractMarketType = 'usdt' | 'coin' | 'option' | 'smart'
export type ContractPositionMode = 'open' | 'close'
export type ContractOrderKind =
  | 'conditional'
  | 'limit'
  | 'market'
  | 'post-only'

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

export const contractMarketTabs: { id: ContractMarketType; label: string }[] = [
  { id: 'usdt', label: 'U本位' },
  { id: 'coin', label: '币本位' },
  { id: 'option', label: '期权' },
  { id: 'smart', label: '聪明钱' },
]

export const contractOrderKinds: { id: ContractOrderKind; label: string }[] = [
  { id: 'conditional', label: '条件委托' },
  { id: 'limit', label: '限价委托' },
  { id: 'market', label: '市价委托' },
  { id: 'post-only', label: '只做 Maker' },
]

export const contractLeverageOptions = [5, 10, 20, 50] as const

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

export function contractFundingRate(pair: MarketPair): {
  ratePercent: string
  countdown: string
} {
  const seed = pair.base.charCodeAt(0) % 7
  const rate = (0.0028 + seed * 0.00012).toFixed(5)
  const minutes = 3 + (seed % 4)
  const seconds = 4 + (seed % 50)
  return {
    ratePercent: `${rate}%`,
    countdown: `0${minutes}:${String(seconds).padStart(2, '0')}:52`,
  }
}
