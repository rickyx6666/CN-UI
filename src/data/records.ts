import type { WalletNetwork } from './wallet'

export type FundRecordType = 'deposit' | 'withdraw'
export type FundRecordStatus = 'pending' | 'completed' | 'failed'

export type RecordsScreenName =
  | 'fund'
  | 'fund-detail'
  | 'deposit-detail'
  | 'orders'
  | 'order-detail'
  | 'contract-records'
  | 'contract-order-detail'

export interface RecordsScreenState {
  screen: RecordsScreenName
  fundId?: string
  orderId?: string
}

export interface FundRecord {
  id: string
  type: FundRecordType
  coin: string
  chain: WalletNetwork
  amount: number
  fee: number
  status: FundRecordStatus
  address: string
  txHash: string
  createdAt: number
  /** 充币：来源地址 */
  fromAddress?: string
  /** 充币：已确认区块数 */
  confirmations?: number
  /** 充币：所需确认数 */
  requiredConfirmations?: number
}

export const recordsCopy = {
  fundTitle: '充提记录',
  fundDetailTitle: '流水详情',
  withdrawDetailTitle: '提现详情',
  depositDetailTitle: '充币详情',
  ordersTitle: '现货订单',
  orderDetailTitle: '委托详情',
  contractRecordsTitle: '交易',
  contractRecordsSubtitle: 'U本位合约',
  contractOrderDetailTitle: '委托历史详情',
} as const

export const mockFundRecords: FundRecord[] = [
  {
    id: 'fund-001',
    type: 'deposit',
    coin: 'USDT',
    chain: 'TRC20',
    amount: 500,
    fee: 0,
    status: 'completed',
    address: 'TWkiCUbq191nxF5aRbVN9EqvDVPJLdPpZS',
    fromAddress: 'TXk3yP9n8vL2mR4qW6sH1jF5cD7bA9eG0x',
    txHash: '0xa1b2c3d4e5f6789012345678901234567890abcd',
    confirmations: 3,
    requiredConfirmations: 3,
    createdAt: Date.now() - 86_400_000 * 2,
  },
  {
    id: 'fund-002',
    type: 'deposit',
    coin: 'BNB',
    chain: 'BSC',
    amount: 2.5,
    fee: 0,
    status: 'pending',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    fromAddress: '0x8f3A2b1c9d4e5f6789012345678901234567890ab',
    txHash: '0xb2c3d4e5f6789012345678901234567890abcdef12',
    confirmations: 8,
    requiredConfirmations: 15,
    createdAt: Date.now() - 1_800_000,
  },
  {
    id: 'fund-003',
    type: 'withdraw',
    coin: 'USDT',
    chain: 'BEP20',
    amount: 20_000,
    fee: 0.15,
    status: 'completed',
    address: '0x7CB9c5dB4e5f6789012345678901234567890abcd',
    txHash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
    createdAt: new Date('2026-06-22T19:43:00').getTime(),
  },
  {
    id: 'fund-004',
    type: 'withdraw',
    coin: 'TRX',
    chain: 'TRC20',
    amount: 2000,
    fee: 1,
    status: 'pending',
    address: 'TXk9yP1n8vL2mR4qW6sH1jF5cD7bA9eG0y',
    txHash: '—',
    createdAt: Date.now() - 3_600_000,
  },
]

export function formatRecordTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getFundStatusLabel(status: FundRecordStatus): string {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'pending':
      return '处理中'
    default:
      return '失败'
  }
}

export function getFundTypeLabel(type: FundRecordType): string {
  return type === 'deposit' ? '充币' : '提币'
}

export function getFundRecord(id: string, records: FundRecord[]): FundRecord | undefined {
  return records.find((r) => r.id === id)
}
