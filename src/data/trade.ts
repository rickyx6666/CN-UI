import type { MarketPair } from './mock'
import { formatPrice } from './mock'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market'
export type OrderStatus = 'open' | 'filled' | 'cancelled'

export interface SpotBalance {
  symbol: string
  available: number
  frozen: number
}

export interface OrderBookLevel {
  price: number
  amount: number
}

export interface SpotOrder {
  id: string
  pairId: string
  base: string
  quote: string
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  filled: number
  total: number
  fee: number
  status: OrderStatus
  createdAt: number
}

export interface PendingOrder {
  pairId: string
  base: string
  quote: string
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  total: number
  fee: number
}

export type TradeSheet = 'confirm' | 'pair-picker' | null
export type TradePanelTab = 'orders' | 'assets'

export const TRADE_FEE_RATE = 0.001

export const defaultSpotBalances: SpotBalance[] = [
  { symbol: 'USDT', available: 8_420.5, frozen: 0 },
  { symbol: 'BTC', available: 0.0524, frozen: 0 },
  { symbol: 'ETH', available: 1.18, frozen: 0 },
  { symbol: 'BNB', available: 4.28, frozen: 0 },
  { symbol: 'TRX', available: 12_800, frozen: 0 },
  { symbol: 'SOL', available: 8.6, frozen: 0 },
]

export const spotOrderBookLevels = 5
export const contractOrderBookLevels = 7

export function generateOrderBook(
  midPrice: number,
  levels = 5,
): {
  asks: OrderBookLevel[]
  bids: OrderBookLevel[]
} {
  const asks: OrderBookLevel[] = []
  const bids: OrderBookLevel[] = []
  const step = midPrice >= 100 ? midPrice * 0.00015 : midPrice * 0.0008

  for (let i = levels; i >= 1; i -= 1) {
    asks.push({
      price: midPrice + step * i,
      amount: 0.08 + i * 0.04,
    })
    bids.push({
      price: midPrice - step * i,
      amount: 0.1 + i * 0.035,
    })
  }

  return { asks, bids }
}

export function getAmountDecimals(symbol: string): number {
  if (symbol === 'BTC') return 5
  if (symbol === 'ETH') return 4
  if (symbol === 'TRX') return 0
  if (symbol === 'USDT') return 2
  return 3
}

export function formatTradeAmount(value: number, symbol: string): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: getAmountDecimals(symbol),
  })
}

export function calcOrderTotal(
  price: number,
  amount: number,
  side: OrderSide,
): { total: number; fee: number } {
  const gross = price * amount
  const fee = gross * TRADE_FEE_RATE
  return {
    total: side === 'buy' ? gross + fee : gross - fee,
    fee,
  }
}

export function getAvailableBalance(
  balances: SpotBalance[],
  symbol: string,
): number {
  return balances.find((b) => b.symbol === symbol)?.available ?? 0
}

export function validateOrderInput(input: {
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  pair: MarketPair
  balances: SpotBalance[]
}): string | null {
  const { side, type, price, amount, pair, balances } = input

  if (!amount || amount <= 0) return '请输入有效数量'
  if (type === 'limit' && (!price || price <= 0)) return '请输入有效价格'

  const effectivePrice = type === 'market' ? pair.price : price
  const { total, fee } = calcOrderTotal(effectivePrice, amount, side)

  if (side === 'buy') {
    const usdt = getAvailableBalance(balances, pair.quote)
    if (total > usdt) return 'USDT 余额不足'
  } else {
    const base = getAvailableBalance(balances, pair.base)
    if (amount > base) return `${pair.base} 余额不足`
  }

  if (fee <= 0) return '订单金额过小'

  return null
}

export function formatOrderPrice(price: number, quote = 'USDT'): string {
  return `${formatPrice(price)} ${quote}`
}

export function formatOrderTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** 交易记录列表用：含年月日与秒 */
export function formatTradeRecordTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function getOrderDisplayStatus(order: SpotOrder): string {
  if (order.status === 'cancelled') return '已撤销'
  if (order.status === 'filled' || order.filled >= order.amount) return '完全成交'
  if (order.filled > 0) return '部分成交'
  return '委托中'
}

/** 历史委托列表状态文案（对齐参考稿） */
export function getOrderHistoryStatus(order: SpotOrder): string {
  if (order.status === 'cancelled') return '撤销'
  if (order.status === 'filled' || order.filled >= order.amount) return '完全成交'
  if (order.filled > 0) return '部分成交'
  return '委托中'
}

export function getAvgFillPrice(order: SpotOrder): number {
  return order.filled > 0 ? order.price : 0
}

export function getFilledTotal(order: SpotOrder): number {
  if (order.filled <= 0) return 0
  return order.filled * order.price
}

export function getOrderTradeAmount(order: SpotOrder): number {
  return order.side === 'buy' ? order.total : order.price * order.amount
}

export function getLiquidityLabel(order: SpotOrder): string {
  return order.type === 'limit' ? '挂单' : '吃单'
}

export function formatSpotQuote(value: number, quote = 'USDT'): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })} ${quote}`
}

export function formatSpotBase(value: number, base: string): string {
  return `${formatTradeAmount(value, base)} ${base}`
}

function ts(y: number, m: number, d: number, h: number, min: number, s = 0): number {
  return new Date(y, m - 1, d, h, min, s).getTime()
}

/** 原型演示用订单数据（现货订单 / 订单记录） */
export const demoSpotOrders: SpotOrder[] = [
  {
    id: 'ord-open-bgb',
    pairId: 'bgb',
    base: 'BGB',
    quote: 'USDT',
    side: 'buy',
    type: 'limit',
    price: 1,
    amount: 3.1256,
    filled: 0,
    total: 3.1256,
    fee: 0.0031256,
    status: 'open',
    createdAt: ts(2026, 6, 23, 22, 36, 7),
  },
  {
    id: 'ord-open-btc',
    pairId: 'btc',
    base: 'BTC',
    quote: 'USDT',
    side: 'buy',
    type: 'limit',
    price: 67_842.5,
    amount: 0.02,
    filled: 0,
    total: 1_356.85,
    fee: 1.35685,
    status: 'open',
    createdAt: Date.now() - 1_800_000,
  },
  {
    id: 'ord-partial-eth',
    pairId: 'eth',
    base: 'ETH',
    quote: 'USDT',
    side: 'sell',
    type: 'limit',
    price: 3_450,
    amount: 1.5,
    filled: 0.6,
    total: 5_175,
    fee: 5.175,
    status: 'open',
    createdAt: Date.now() - 7_200_000,
  },
  {
    id: 'ord-pop-1',
    pairId: 'pop',
    base: 'POP',
    quote: 'USDT',
    side: 'buy',
    type: 'market',
    price: 0.04519,
    amount: 2_434.23,
    filled: 2_434.23,
    total: 110.01,
    fee: 2.43423,
    status: 'filled',
    createdAt: ts(2026, 3, 13, 11, 20, 31),
  },
  {
    id: 'ord-pop-2',
    pairId: 'pop',
    base: 'POP',
    quote: 'USDT',
    side: 'buy',
    type: 'market',
    price: 0.05249,
    amount: 691.31,
    filled: 691.31,
    total: 36.29,
    fee: 0.69131,
    status: 'filled',
    createdAt: ts(2026, 3, 13, 11, 20, 15),
  },
  {
    id: 'ord-pop-3',
    pairId: 'pop',
    base: 'POP',
    quote: 'USDT',
    side: 'buy',
    type: 'market',
    price: 0.05214,
    amount: 3_705.4,
    filled: 3_705.4,
    total: 193.2,
    fee: 3.7054,
    status: 'filled',
    createdAt: ts(2026, 3, 13, 11, 20, 13),
  },
  {
    id: 'ord-hist-preopai',
    pairId: 'preopai',
    base: 'preOPAI',
    quote: 'USDT',
    side: 'sell',
    type: 'limit',
    price: 866.6,
    amount: 6.0454,
    filled: 6.0454,
    total: 5_238.94364,
    fee: 10.47788728,
    status: 'filled',
    createdAt: ts(2026, 6, 16, 23, 37, 3),
  },
  {
    id: 'ord-hist-preopai-cancel',
    pairId: 'preopai',
    base: 'preOPAI',
    quote: 'USDT',
    side: 'sell',
    type: 'limit',
    price: 866.6,
    amount: 6.0454,
    filled: 0,
    total: 5_238.94364,
    fee: 0,
    status: 'cancelled',
    createdAt: ts(2026, 6, 16, 23, 37, 3),
  },
  {
    id: 'ord-hist-btc-sell',
    pairId: 'btc',
    base: 'BTC',
    quote: 'USDT',
    side: 'sell',
    type: 'limit',
    price: 68_200,
    amount: 0.015,
    filled: 0.015,
    total: 1_023,
    fee: 1.023,
    status: 'filled',
    createdAt: ts(2026, 3, 12, 16, 42, 8),
  },
  {
    id: 'ord-hist-sol-cancel',
    pairId: 'sol',
    base: 'SOL',
    quote: 'USDT',
    side: 'buy',
    type: 'limit',
    price: 142.5,
    amount: 12,
    filled: 0,
    total: 1_710,
    fee: 1.71,
    status: 'cancelled',
    createdAt: ts(2026, 3, 11, 9, 15, 0),
  },
  {
    id: 'ord-hist-eth-partial-done',
    pairId: 'eth',
    base: 'ETH',
    quote: 'USDT',
    side: 'buy',
    type: 'limit',
    price: 3_380,
    amount: 0.8,
    filled: 0.35,
    total: 2_704,
    fee: 2.704,
    status: 'cancelled',
    createdAt: ts(2026, 3, 10, 14, 8, 22),
  },
]

export function cloneDemoSpotOrders(): SpotOrder[] {
  return demoSpotOrders.map((o) => ({ ...o }))
}

export function applyMarketFill(
  balances: SpotBalance[],
  order: Pick<SpotOrder, 'side' | 'base' | 'quote' | 'price' | 'amount' | 'total' | 'fee'>,
): SpotBalance[] {
  const next = balances.map((b) => ({ ...b }))

  const adjust = (symbol: string, availableDelta: number) => {
    const row = next.find((b) => b.symbol === symbol)
    if (row) row.available = Math.max(0, row.available + availableDelta)
  }

  if (order.side === 'buy') {
    adjust(order.quote, -order.total)
    adjust(order.base, order.amount)
  } else {
    adjust(order.base, -order.amount)
    adjust(order.quote, order.price * order.amount - order.fee)
  }

  return next
}

export function freezeForLimitOrder(
  balances: SpotBalance[],
  order: Pick<PendingOrder, 'side' | 'base' | 'quote' | 'amount' | 'total'>,
): SpotBalance[] {
  const next = balances.map((b) => ({ ...b }))

  if (order.side === 'buy') {
    const row = next.find((b) => b.symbol === order.quote)
    if (row) {
      row.available -= order.total
      row.frozen += order.total
    }
  } else {
    const row = next.find((b) => b.symbol === order.base)
    if (row) {
      row.available -= order.amount
      row.frozen += order.amount
    }
  }

  return next
}

export function unfreezeLimitOrder(
  balances: SpotBalance[],
  order: Pick<SpotOrder, 'side' | 'base' | 'quote' | 'amount' | 'total'>,
): SpotBalance[] {
  const next = balances.map((b) => ({ ...b }))

  if (order.side === 'buy') {
    const row = next.find((b) => b.symbol === order.quote)
    if (row) {
      row.available += order.total
      row.frozen = Math.max(0, row.frozen - order.total)
    }
  } else {
    const row = next.find((b) => b.symbol === order.base)
    if (row) {
      row.available += order.amount
      row.frozen = Math.max(0, row.frozen - order.amount)
    }
  }

  return next
}

export const orderBookDepthOptions = ['0.0001', '0.001', '0.01', '0.1'] as const
export type OrderBookDepth = (typeof orderBookDepthOptions)[number]

export function formatOrderBookPrice(
  price: number,
  depth: OrderBookDepth,
): string {
  const step = Number(depth)
  const decimals =
    depth === '0.0001' ? 4 : depth === '0.001' ? 3 : depth === '0.01' ? 2 : 1
  const rounded = Math.round(price / step) * step
  return rounded.toFixed(decimals)
}

export const tradeCopy = {
  buy: '买入',
  sell: '卖出',
  limit: '限价',
  market: '市价',
  openOrders: '委托',
  assets: '资产',
  confirmTitle: '确认下单',
  placeOrder: '下单',
  orderBookDepthTitle: '委托表展示深度',
} as const
