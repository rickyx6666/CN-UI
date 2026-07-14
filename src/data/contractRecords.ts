import type {
  ContractMarginMode,
  ContractOrderCategory,
  ContractOrderIntent,
} from './contract'

export type ContractHistoryOrderStatus = 'filled' | 'cancelled' | 'partial'

export interface ContractHistoryOrderFill {
  id: string
  filledAt: number
  size: number
  price: number
  realizedPnl: number
  fee: number
  role: 'maker' | 'taker'
}

export interface ContractHistoryOrder {
  id: string
  orderNo: string
  category: ContractOrderCategory
  symbol: string
  side: 'long' | 'short'
  intent: ContractOrderIntent
  orderType: 'limit' | 'market'
  size: number
  filled: number
  orderPrice: number | null
  avgPrice: number | null
  reduceOnly?: boolean
  triggered?: boolean
  status: ContractHistoryOrderStatus
  fee?: number | null
  realizedPnl?: number | null
  createdAt: number
  updatedAt: number
  cancelledAt?: number
  fills?: ContractHistoryOrderFill[]
}

export type ContractPositionHistoryStatus = 'fully_closed' | 'partially_closed'

export interface ContractPositionHistory {
  id: string
  symbol: string
  side: 'long' | 'short'
  marginMode: ContractMarginMode
  leverage: number
  maxOpenInterest: number
  closedSize: number
  entryPrice: number
  closePrice: number
  realizedPnl: number
  roePercent: number
  status: ContractPositionHistoryStatus
  openedAt: number
  closedAt: number
}

export interface ContractFillRecord {
  id: string
  symbol: string
  side: 'long' | 'short'
  intent: ContractOrderIntent
  price: number
  size: number
  fee: number
  role: 'maker' | 'taker'
  filledAt: number
}

export type ContractFundFlowType =
  | 'transfer'
  | 'realized_pnl'
  | 'fee'
  | 'liquidation'
  | 'funding'

export interface ContractFundFlowRecord {
  id: string
  type: ContractFundFlowType
  symbol?: string
  amount: number
  asset: string
  createdAt: number
}

export interface ContractFundingFeeRecord {
  id: string
  symbol: string
  side: 'long' | 'short'
  positionSize: number
  ratePercent: number
  fee: number
  createdAt: number
}

export const contractHistoryOrders: ContractHistoryOrder[] = [
  {
    id: 'hist-1',
    orderNo: '3348129031',
    category: 'basic',
    symbol: 'BTC',
    side: 'short',
    intent: 'open',
    orderType: 'limit',
    size: 0.06,
    filled: 0.06,
    orderPrice: 60_850,
    avgPrice: 61_623.6,
    status: 'filled',
    fee: 0.3697,
    realizedPnl: 0,
    createdAt: new Date('2026-07-08T23:14:38').getTime(),
    updatedAt: new Date('2026-07-08T23:14:38').getTime(),
    fills: [
      {
        id: 'hist-1-fill-1',
        filledAt: new Date('2026-07-08T23:14:38').getTime(),
        size: 0.06,
        price: 61_623.6,
        realizedPnl: 0,
        fee: 0.3697,
        role: 'taker',
      },
    ],
  },
  {
    id: 'hist-2',
    orderNo: '3341028844',
    category: 'basic',
    symbol: 'ETH',
    side: 'long',
    intent: 'close',
    orderType: 'limit',
    size: 1,
    filled: 1,
    orderPrice: 1_685.53,
    avgPrice: 1_685.53,
    reduceOnly: true,
    status: 'filled',
    fee: 0.8428,
    realizedPnl: -303.94,
    createdAt: new Date('2026-06-06T13:18:19').getTime(),
    updatedAt: new Date('2026-06-06T13:18:19').getTime(),
    fills: [
      {
        id: 'hist-2-fill-1',
        filledAt: new Date('2026-06-06T13:18:19').getTime(),
        size: 1,
        price: 1_685.53,
        realizedPnl: -303.94,
        fee: 0.8428,
        role: 'maker',
      },
    ],
  },
  {
    id: 'hist-3',
    orderNo: '3339017722',
    category: 'basic',
    symbol: 'ETH',
    side: 'long',
    intent: 'open',
    orderType: 'limit',
    size: 0.1,
    filled: 0.1,
    orderPrice: 1_685.53,
    avgPrice: 1_685.53,
    status: 'filled',
    fee: 0.0843,
    realizedPnl: 0,
    createdAt: new Date('2026-06-05T16:48:16').getTime(),
    updatedAt: new Date('2026-06-05T16:48:16').getTime(),
    fills: [
      {
        id: 'hist-3-fill-1',
        filledAt: new Date('2026-06-05T16:48:16').getTime(),
        size: 0.1,
        price: 1_685.53,
        realizedPnl: 0,
        fee: 0.0843,
        role: 'maker',
      },
    ],
  },
  {
    id: 'hist-4',
    orderNo: '3326674653',
    category: 'basic',
    symbol: 'LAB',
    side: 'long',
    intent: 'open',
    orderType: 'limit',
    size: 8,
    filled: 0,
    orderPrice: 10.3,
    avgPrice: null,
    status: 'cancelled',
    fee: null,
    realizedPnl: 0,
    createdAt: new Date('2026-06-01T15:22:12').getTime(),
    updatedAt: new Date('2026-06-01T15:51:46').getTime(),
    cancelledAt: new Date('2026-06-01T15:51:46').getTime(),
    fills: [],
  },
  {
    id: 'hist-5',
    orderNo: '3330905863',
    category: 'basic',
    symbol: 'LAB',
    side: 'long',
    intent: 'close',
    orderType: 'market',
    size: 150,
    filled: 150,
    orderPrice: null,
    avgPrice: 11.104_648,
    triggered: true,
    reduceOnly: true,
    status: 'filled',
    fee: 0.832_848_59,
    realizedPnl: 9.582_199_86,
    createdAt: new Date('2026-06-01T16:03:05').getTime(),
    updatedAt: new Date('2026-06-01T16:03:05').getTime(),
    fills: [
      {
        id: 'hist-5-fill-1',
        filledAt: new Date('2026-06-01T16:03:05').getTime(),
        size: 1,
        price: 11.1071,
        realizedPnl: 0.066_333_33,
        fee: 0.005_553_55,
        role: 'taker',
      },
      {
        id: 'hist-5-fill-2',
        filledAt: new Date('2026-06-01T16:03:05').getTime(),
        size: 1,
        price: 11.1067,
        realizedPnl: 0.066_133_33,
        fee: 0.005_553_35,
        role: 'taker',
      },
    ],
  },
]

export const contractPositionHistory: ContractPositionHistory[] = [
  {
    id: 'pos-hist-1',
    symbol: 'BTC',
    side: 'short',
    marginMode: 'cross',
    leverage: 19,
    maxOpenInterest: 0.06,
    closedSize: 0.06,
    entryPrice: 61_623.6,
    closePrice: 61_598.6,
    realizedPnl: -2.2,
    roePercent: -1.13,
    status: 'fully_closed',
    openedAt: new Date('2026-07-08T23:14:38').getTime(),
    closedAt: new Date('2026-07-08T23:15:00').getTime(),
  },
  {
    id: 'pos-hist-2',
    symbol: 'ETH',
    side: 'long',
    marginMode: 'cross',
    leverage: 7,
    maxOpenInterest: 4.6,
    closedSize: 4.6,
    entryPrice: 1_989.47,
    closePrice: 1_783.79,
    realizedPnl: -946.78,
    roePercent: -6.79,
    status: 'fully_closed',
    openedAt: new Date('2026-05-28T10:20:00').getTime(),
    closedAt: new Date('2026-06-06T13:18:19').getTime(),
  },
]

export const contractFillRecords: ContractFillRecord[] = [
  {
    id: 'fill-1',
    symbol: 'BTC',
    side: 'short',
    intent: 'open',
    price: 61_623.6,
    size: 0.06,
    fee: 0.3697,
    role: 'taker',
    filledAt: new Date('2026-07-08T23:14:38').getTime(),
  },
  {
    id: 'fill-2',
    symbol: 'ETH',
    side: 'long',
    intent: 'close',
    price: 1_685.53,
    size: 1,
    fee: 0.8428,
    role: 'maker',
    filledAt: new Date('2026-06-06T13:18:19').getTime(),
  },
  {
    id: 'fill-3',
    symbol: 'ETH',
    side: 'long',
    intent: 'open',
    price: 1_685.53,
    size: 0.1,
    fee: 0.0843,
    role: 'maker',
    filledAt: new Date('2026-06-05T16:48:16').getTime(),
  },
]

export const contractFundFlowRecords: ContractFundFlowRecord[] = [
  {
    id: 'flow-1',
    type: 'realized_pnl',
    symbol: 'ETH',
    amount: -946.78,
    asset: 'USDT',
    createdAt: new Date('2026-06-06T13:18:19').getTime(),
  },
  {
    id: 'flow-2',
    type: 'fee',
    symbol: 'BTC',
    amount: -0.3697,
    asset: 'USDT',
    createdAt: new Date('2026-07-08T23:14:38').getTime(),
  },
  {
    id: 'flow-3',
    type: 'transfer',
    amount: 500,
    asset: 'USDT',
    createdAt: new Date('2026-06-01T09:00:00').getTime(),
  },
  {
    id: 'flow-4',
    type: 'funding',
    symbol: 'ETH',
    amount: -1.24,
    asset: 'USDT',
    createdAt: new Date('2026-06-05T08:00:00').getTime(),
  },
]

export const contractFundingFeeRecords: ContractFundingFeeRecord[] = [
  {
    id: 'fund-1',
    symbol: 'ETH',
    side: 'long',
    positionSize: 4.6,
    ratePercent: 0.01,
    fee: -1.24,
    createdAt: new Date('2026-06-05T08:00:00').getTime(),
  },
  {
    id: 'fund-2',
    symbol: 'BTC',
    side: 'short',
    positionSize: 0.06,
    ratePercent: 0.0085,
    fee: 0.31,
    createdAt: new Date('2026-07-08T16:00:00').getTime(),
  },
  {
    id: 'fund-3',
    symbol: 'ETH',
    side: 'long',
    positionSize: 4.6,
    ratePercent: -0.0032,
    fee: 0.42,
    createdAt: new Date('2026-06-04T00:00:00').getTime(),
  },
]

export function contractHistoryOrderLabel(order: ContractHistoryOrder): string {
  const typeLabel =
    order.orderType === 'market'
      ? order.triggered
        ? '市价 (已触发)'
        : '市价'
      : '限价'
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

export function contractHistoryOrderTone(
  order: ContractHistoryOrder,
): 'success' | 'danger' {
  if (order.intent === 'open') {
    return order.side === 'long' ? 'success' : 'danger'
  }
  return order.side === 'long' ? 'danger' : 'success'
}

export function contractHistoryStatusLabel(
  status: ContractHistoryOrderStatus,
): string {
  switch (status) {
    case 'filled':
      return '全部成交'
    case 'cancelled':
      return '已取消'
    case 'partial':
      return '部分成交'
  }
}

export function contractHistoryStatusTone(
  status: ContractHistoryOrderStatus,
): string {
  switch (status) {
    case 'filled':
      return 'text-success'
    case 'cancelled':
      return 'text-secondary'
    case 'partial':
      return 'text-warning'
  }
}

export function contractFundFlowLabel(type: ContractFundFlowType): string {
  switch (type) {
    case 'transfer':
      return '划转'
    case 'realized_pnl':
      return '已实现盈亏'
    case 'fee':
      return '手续费'
    case 'liquidation':
      return '强平'
    case 'funding':
      return '资金费用'
  }
}

function formatPrice(value: number | null): string {
  if (value == null) return '市价'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export function contractHistoryPriceLabel(order: ContractHistoryOrder): string {
  const avg = formatPrice(order.avgPrice)
  const orderPx = formatPrice(order.orderPrice)
  return `${avg} / ${orderPx}`
}

export function contractPositionHistoryStatusLabel(
  status: ContractPositionHistoryStatus,
): string {
  return status === 'fully_closed' ? '完全平仓' : '部分平仓'
}

export function formatContractRecordTime(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export const contractPositionHistoryUpdatedAt = new Date(
  '2026-07-14T17:01:16',
).getTime()

export function getContractHistoryOrder(
  id: string,
): ContractHistoryOrder | undefined {
  return contractHistoryOrders.find((order) => order.id === id)
}

export function contractHistoryDetailStatusLabel(
  order: ContractHistoryOrder,
): string {
  if (order.status === 'cancelled') return '已取消'
  if (order.status === 'partial') {
    const percent = Math.round((order.filled / order.size) * 100)
    return `部分成交 ${percent}%`
  }
  return '全部成交 100%'
}

export function contractHistoryFillRoleLabel(
  role: ContractHistoryOrderFill['role'],
): string {
  return role === 'maker' ? '挂单' : '吃单'
}
