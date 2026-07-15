import type { MarketPair } from './mock'
import { marketPairs } from './mock'
import { isContractPairId } from './productModule'

export type ContractMarketType = 'usdt' | 'coin' | 'option' | 'smart'
export type ContractPositionMode = 'open' | 'close'
export type ContractMarginMode = 'cross' | 'isolated'
export type ContractOrderKind =
  | 'limit'
  | 'market'
  | 'conditional'
  | 'post-only'
  | 'trailing'

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
  marginMode: ContractMarginMode
  leverage: number
  size: number
  entryPrice: number
  markPrice: number
  liquidationPrice: number
  pnlUsd: number
  roePercent: number
  marginUsd: number
  marginRatioPercent: number
  takeProfitPrice: number
  stopLossPrice: number
}

export const contractMarketTabs: { id: ContractMarketType; label: string }[] = [
  { id: 'usdt', label: 'U本位' },
  { id: 'coin', label: '币本位' },
  { id: 'option', label: '期权' },
  { id: 'smart', label: '聪明钱' },
]

export const contractOrderKinds: { id: ContractOrderKind; label: string }[] = [
  { id: 'limit', label: '限价单' },
  { id: 'market', label: '市价单' },
  { id: 'conditional', label: '条件委托' },
  { id: 'post-only', label: '只做 Maker' },
]

export const contractCloseOrderKinds: { id: ContractOrderKind; label: string }[] = [
  { id: 'limit', label: '限价单' },
  { id: 'market', label: '市价单' },
  { id: 'trailing', label: '跟踪委托' },
]

export const contractLeverageOptions = [5, 10, 19, 20, 50] as const

export const contractOpenOrderCount = 3

/** USDT 永续 · 取现货 Top 标的生成合约行情 */
export const contractPairs: MarketPair[] = marketPairs.slice(0, 16).map((pair) => ({
  ...pair,
  id: `perp-${pair.id}`,
  volume24h: pair.volume24h * 1.35,
}))

export const contractPortfolioSummary: ContractPortfolioSummary = {
  equityUsd: 4_820.5,
  availableMarginUsd: 2_129.16,
  unrealizedPnlUsd: -946.78,
  marginRatioPercent: 0.98,
}

export const contractMarginBalanceInfoCopy = {
  title: '保证金余额',
  description:
    '保证金余额：用户在合约账户中拥有的总资产。账户净值 = 仓位冻结+订单冻结+未实现盈亏+账户余额+体验金。',
  confirmLabel: '好的',
} as const

export const contractPositions: ContractPosition[] = [
  {
    id: 'pos-eth-long',
    symbol: 'ETH',
    side: 'long',
    marginMode: 'cross',
    leverage: 7,
    size: 4.6,
    entryPrice: 1_989.47,
    markPrice: 1_783.79,
    liquidationPrice: 1_058.75,
    pnlUsd: -946.78,
    roePercent: -80.75,
    marginUsd: 1_172.55,
    marginRatioPercent: 0.98,
    takeProfitPrice: 2_246,
    stopLossPrice: 1_364,
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
  const rate = (0.003 + seed * 0.00005).toFixed(5)
  const minutes = 2 + (seed % 3)
  const seconds = 58 - (seed % 20)
  return {
    ratePercent: `${rate}%`,
    countdown: `0${minutes}:${String(seconds).padStart(2, '0')}:24`,
  }
}

export interface ContractFundingDetail {
  intervalHours: number
  rateCapPercent: string
  rateFloorPercent: string
  previousRatePercent: string
  previousAnnualizedPercent: string
  expectedRatePercent: string
  expectedAnnualizedPercent: string
  estimatedFeeUsdt: number
  direction: 'long_pays_short' | 'short_pays_long'
}

export function contractFundingDetail(pair: MarketPair): ContractFundingDetail {
  const seed = pair.base.charCodeAt(0) % 7
  const rateValue = 0.002 + seed * 0.0001
  const previousRate = 0.00012
  const expectedRate = rateValue
  const annualized = (expectedRate * 3 * 365 * 100).toFixed(2)
  const prevAnnualized = (previousRate * 3 * 365 * 100).toFixed(2)
  const estimatedFee = -(0.18 + seed * 0.06)

  return {
    intervalHours: 8,
    rateCapPercent: '0.30000%',
    rateFloorPercent: '-0.30000%',
    previousRatePercent: `${(previousRate * 100).toFixed(5)}%`,
    previousAnnualizedPercent: `${prevAnnualized}%`,
    expectedRatePercent: `${(expectedRate * 100).toFixed(5)}%`,
    expectedAnnualizedPercent: `${annualized}%`,
    estimatedFeeUsdt: estimatedFee,
    direction: expectedRate >= 0 ? 'long_pays_short' : 'short_pays_long',
  }
}

export function contractMarginModeLabel(mode: ContractMarginMode): string {
  return mode === 'cross' ? '全仓' : '逐仓'
}

/** 保证金率：<60% 绿，>60% 黄，>80% 红 */
export function contractMarginRatioClass(percent: number): string {
  if (percent > 80) return 'text-danger'
  if (percent > 60) return 'text-warning'
  return 'text-success'
}

export type ContractOrderCategory = 'basic' | 'conditional'
export type ContractOrderIntent = 'open' | 'close'
export type ContractTpSlType = 'take-profit' | 'stop-loss'

export interface ContractBasicOrder {
  id: string
  category: 'basic'
  symbol: string
  side: 'long' | 'short'
  intent: ContractOrderIntent
  orderType: 'limit' | 'market'
  price: number
  size: number
  filled: number
  fillPercent: number
  createdAt: number
}

export interface ContractTpSlOrder {
  id: string
  category: 'conditional'
  symbol: string
  side: 'long' | 'short'
  tpSlType: ContractTpSlType
  triggerPrice: number
  triggerComparator: 'lte' | 'gte'
  orderPrice: number | null
  size: number
  reduceOnly: boolean
  createdAt: number
}

export type ContractOpenOrder = ContractBasicOrder | ContractTpSlOrder

export const contractOpenOrders: ContractOpenOrder[] = [
  {
    id: 'copen-1',
    category: 'basic',
    symbol: 'ETH',
    side: 'long',
    intent: 'open',
    orderType: 'limit',
    price: 1_444,
    size: 0.25,
    filled: 0,
    fillPercent: 0,
    createdAt: new Date('2026-06-05T16:48:16').getTime(),
  },
  {
    id: 'ctpsl-1',
    category: 'conditional',
    symbol: 'ETH',
    side: 'long',
    tpSlType: 'take-profit',
    triggerPrice: 2_246,
    triggerComparator: 'gte',
    orderPrice: 2_246,
    size: 4.6,
    reduceOnly: true,
    createdAt: new Date('2026-06-05T09:12:08').getTime(),
  },
  {
    id: 'ctpsl-2',
    category: 'conditional',
    symbol: 'ETH',
    side: 'long',
    tpSlType: 'stop-loss',
    triggerPrice: 1_364,
    triggerComparator: 'lte',
    orderPrice: null,
    size: 4.6,
    reduceOnly: true,
    createdAt: new Date('2026-06-06T13:33:17').getTime(),
  },
]

export function contractOrderSideLabel(order: ContractBasicOrder): string {
  const typeLabel = order.orderType === 'limit' ? '限价' : '市价'
  const actionLabel =
    order.intent === 'open'
      ? order.side === 'long'
        ? '开多'
        : '开空'
      : order.side === 'long'
        ? '平多'
        : '平空'
  return `${typeLabel} / ${actionLabel}`
}

export function contractTpSlLabel(order: ContractTpSlOrder): string {
  const isMarket = order.orderPrice == null
  const typeLabel =
    order.tpSlType === 'take-profit'
      ? isMarket
        ? '市价止盈'
        : '限价止盈'
      : isMarket
        ? '市价止损'
        : '限价止损'
  const actionLabel = order.side === 'long' ? '平多' : '平空'
  return `${typeLabel} / ${actionLabel}`
}

export function contractTpSlTriggerLabel(order: ContractTpSlOrder): string {
  const symbol = order.triggerComparator === 'lte' ? '≤' : '≥'
  return `标记价格${symbol}${formatContractPrice(order.triggerPrice)}`
}

function formatContractPrice(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function contractOrderSideTone(
  order: ContractBasicOrder,
): 'success' | 'danger' {
  if (order.intent === 'open') {
    return order.side === 'long' ? 'success' : 'danger'
  }
  return order.side === 'long' ? 'danger' : 'success'
}

export function contractTpSlTone(order: ContractTpSlOrder): 'success' | 'danger' {
  return order.tpSlType === 'take-profit' ? 'success' : 'danger'
}

export function contractClosableSize(
  symbol: string,
  side: 'long' | 'short',
): number {
  return contractPositions
    .filter((position) => position.symbol === symbol && position.side === side)
    .reduce((total, position) => total + position.size, 0)
}

export function contractPositionEntryPrice(
  symbol: string,
  side: 'long' | 'short',
): number | null {
  const position = contractPositions.find(
    (item) => item.symbol === symbol && item.side === side,
  )
  return position?.entryPrice ?? null
}

export function contractEstimatedClosePnl(
  entryPrice: number,
  triggerPrice: number,
  size: number,
  side: 'long' | 'short',
): number {
  const diff =
    side === 'long' ? triggerPrice - entryPrice : entryPrice - triggerPrice
  return diff * size
}
