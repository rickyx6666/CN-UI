export type WalletCoin = 'USDT' | 'BNB' | 'TRX'
export type WalletNetwork = 'BSC' | 'TRC20' | 'BEP20' | 'ERC20' | 'SOL' | 'TON'

export type WalletScreenName =
  | 'deposit'
  | 'deposit-fetching'
  | 'deposit-address'
  | 'deposit-save-success'
  | 'withdraw'
  | 'withdraw-verify'
  | 'withdraw-success'
  | 'transfer'

export type TransferAccount = 'funding' | 'spot'

export interface WalletScreenState {
  screen: WalletScreenName
  coin?: WalletCoin
  chain?: WalletNetwork
}

export interface WithdrawDraft {
  coin: WalletCoin
  chain: WalletNetwork
  address: string
  amount: number
  fee: number
  receive: number
}

export interface WalletAsset {
  id: string
  symbol: WalletCoin
  withdrawChains: WalletNetwork[]
}

export interface DepositNetworkMeta {
  id: WalletNetwork
  label: string
  blockConfirmations: number
  minDeposit: string
  arrivalMinutes: number
  contractAddress?: string
  /** PC 充币页展示：合约地址结尾 */
  contractAddressSuffix?: string
}

export const walletAssets: WalletAsset[] = [
  { id: 'usdt', symbol: 'USDT', withdrawChains: ['BSC', 'TRC20'] },
  { id: 'bnb', symbol: 'BNB', withdrawChains: ['BSC'] },
  { id: 'trx', symbol: 'TRX', withdrawChains: ['TRC20'] },
]

const depositAddresses: Record<string, string> = {
  'USDT-TRC20': 'TWkiCUbq191nxF5aRbVN9EqvDVPJLdPpZS',
  'USDT-BEP20': '0x669d037abfd9cda5ce98ebfc67e2a0f1ed31ffeb',
  'USDT-ERC20': '0x8f3A2b1c9d4e5f6789012345678901234567890ab',
  'USDT-SOL': '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  'USDT-TON': 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw',
  'BNB-BEP20': '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  'TRX-TRC20': 'TXk3yP9n8vL2mR4qW6sH1jF5cD7bA9eG0x',
}

const depositNetworkMeta: Record<WalletCoin, DepositNetworkMeta[]> = {
  USDT: [
    {
      id: 'TRC20',
      label: 'TRC20 (Tron)',
      blockConfirmations: 3,
      minDeposit: '0.01 USDT',
      arrivalMinutes: 1,
      contractAddress: '****jLj6t',
    },
    {
      id: 'BEP20',
      label: 'BEP20 (Binance Smart Chain)',
      blockConfirmations: 15,
      minDeposit: '0.01 USDT',
      arrivalMinutes: 1,
      contractAddress: '0x55d398326f99059fF775485246999027B3197955',
      contractAddressSuffix: '97955',
    },
    {
      id: 'ERC20',
      label: 'ERC20 (Ethereum)',
      blockConfirmations: 12,
      minDeposit: '0.01 USDT',
      arrivalMinutes: 1,
      contractAddress: '****dAC17',
    },
    {
      id: 'SOL',
      label: 'SOL (Solana)',
      blockConfirmations: 5,
      minDeposit: '0.01 USDT',
      arrivalMinutes: 2,
    },
    {
      id: 'TON',
      label: 'TON (The Open Network)',
      blockConfirmations: 10,
      minDeposit: '0.01 USDT',
      arrivalMinutes: 1,
    },
  ],
  BNB: [
    {
      id: 'BEP20',
      label: 'BEP20 (Binance Smart Chain)',
      blockConfirmations: 15,
      minDeposit: '0.01 BNB',
      arrivalMinutes: 1,
    },
  ],
  TRX: [
    {
      id: 'TRC20',
      label: 'TRC20 (Tron)',
      blockConfirmations: 3,
      minDeposit: '20 TRX',
      arrivalMinutes: 1,
    },
  ],
}

export const withdrawFees: Record<WalletCoin, number> = {
  USDT: 1,
  BNB: 0.0005,
  TRX: 1,
}

export const walletCopy = {
  depositTitle: '充币',
  depositFetchingTitle: '获取地址',
  depositAddressTitle: '充币地址',
  depositSaveSuccessTitle: '保存成功',
  withdrawTitle: '提币',
  withdrawVerifyTitle: '安全验证',
  withdrawSuccessTitle: '提币申请已提交',
  transferTitle: '划转',
} as const

export const transferAccountLabels: Record<TransferAccount, string> = {
  funding: '资金账户',
  spot: '现货账户',
}

/** 原型演示：资金账户可用余额（与资产页展示一致） */
export const fundingBalances: Record<WalletCoin, number> = {
  USDT: 8_420.5,
  BNB: 4.28,
  TRX: 12_800,
}

export function depositKey(coin: WalletCoin, chain: WalletNetwork): string {
  return `${coin}-${chain}`
}

export function getDepositAddress(coin: WalletCoin, chain: WalletNetwork): string {
  return depositAddresses[depositKey(coin, chain)] ?? ''
}

export function getWithdrawChainsForCoin(coin: WalletCoin): WalletNetwork[] {
  return walletAssets.find((a) => a.symbol === coin)?.withdrawChains ?? []
}

/** @deprecated use getWithdrawChainsForCoin */
export function getChainsForCoin(coin: WalletCoin): WalletNetwork[] {
  return getWithdrawChainsForCoin(coin)
}

export function getDepositNetworksForCoin(coin: WalletCoin): DepositNetworkMeta[] {
  return depositNetworkMeta[coin] ?? []
}

export function getDepositNetworkMeta(
  coin: WalletCoin,
  chain: WalletNetwork,
): DepositNetworkMeta | undefined {
  return getDepositNetworksForCoin(coin).find((item) => item.id === chain)
}

/** PC 充币页网络展示名 */
export function getPcDepositNetworkLabel(meta: DepositNetworkMeta): string {
  if (meta.id === 'BEP20') return 'BSC BNB Smart Chain (BEP20)'
  if (meta.id === 'TRC20') return 'TRC20 Tron (TRC20)'
  return meta.label
}

export function formatMinDepositValue(minDeposit: string): string {
  const match = minDeposit.match(/^([\d.]+)\s*(\w+)?$/)
  if (!match) return minDeposit
  const [, amount, symbol] = match
  return symbol ? `大于 ${amount}${symbol}` : `大于 ${amount}`
}

export function formatNetworkLabel(chain: WalletNetwork): string {
  switch (chain) {
    case 'BSC':
      return 'BSC(BEP20)'
    case 'BEP20':
      return 'BEP20 (Binance Smart Chain)'
    case 'TRC20':
      return 'TRC20 (Tron)'
    case 'ERC20':
      return 'ERC20 (Ethereum)'
    case 'SOL':
      return 'SOL (Solana)'
    case 'TON':
      return 'TON (The Open Network)'
    default:
      return chain
  }
}

export function calcWithdrawReceive(amount: number, coin: WalletCoin): {
  fee: number
  receive: number
} {
  const fee = withdrawFees[coin]
  return { fee, receive: Math.max(0, amount - fee) }
}

export const depositWarnings = [
  '请勿向上述地址充值任何非对应网络的资产，否则资产将不可找回',
] as const
