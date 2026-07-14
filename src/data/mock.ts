export interface MarketPair {
  id: string
  symbol: string
  base: string
  quote: string
  price: number
  change24h: number
  volume24h: number
  isFavorite: boolean
}

export interface PortfolioSummary {
  totalUsd: number
  pnl24hUsd: number
  pnl24hPercent: number
}

export interface CoinBalance {
  id: string
  symbol: string
  balance: number
  usdValue: number
  chain?: string
}

export interface BannerSlide {
  id: string
  title: string
  subtitle: string
  tag?: string
}

export interface QuickAction {
  id: 'deposit' | 'withdraw' | 'invite' | 'support'
  label: string
}

export interface SecurityNotice {
  id: string
  level: 'info' | 'warning'
  message: string
}

export type KycStatus = 'unverified' | 'pending' | 'verified'

export interface UserProfile {
  isLoggedIn: boolean
  uid: string
  nickname: string
  email: string
  bio: string
  kycStatus: KycStatus
  googleAuthBound: boolean
  paymentPasswordSet: boolean
  antiPhishingCode: string | null
}

export const portfolioSummary: PortfolioSummary = {
  totalUsd: 12_458.32,
  pnl24hUsd: 86.4,
  pnl24hPercent: 0.7,
}

export const coinBalances: CoinBalance[] = [
  { id: 'usdt', symbol: 'USDT', balance: 8_420.5, usdValue: 8_420.5, chain: 'BSC / TRC20' },
  { id: 'bnb', symbol: 'BNB', balance: 4.28, usdValue: 2_621.84, chain: 'BSC' },
  { id: 'trx', symbol: 'TRX', balance: 12_800, usdValue: 1_415.98, chain: 'TRC20' },
]

export const bannerSlides: BannerSlide[] = [
  {
    id: 'spot',
    tag: '一期',
    title: '现货交易已开放',
    subtitle: '支持市价单与限价单，USDT 计价',
  },
  {
    id: 'deposit',
    tag: '充提',
    title: 'BSC · TRC20 充提',
    subtitle: '支持 USDT、BNB、TRX 链上充提',
  },
  {
    id: 'kyc',
    tag: '合规',
    title: '完成身份认证',
    subtitle: '解锁完整交易与提币功能',
  },
]

export const tradeQuickActions: QuickAction[] = [
  { id: 'deposit', label: '充币' },
  { id: 'withdraw', label: '提币' },
]

export const marketQuickActions: QuickAction[] = [
  { id: 'deposit', label: '充币' },
  { id: 'withdraw', label: '提币' },
  { id: 'invite', label: '邀请好友' },
  { id: 'support', label: '联系客服' },
]

/** @deprecated 使用 marketQuickActions */
export const quickActions: QuickAction[] = marketQuickActions

export const securityNotice: SecurityNotice = {
  id: 'compliance',
  level: 'warning',
  message: '根据合规要求，未完成 KYC 的用户提币功能受限。',
}

/** 一期现货行情：USDT 计价为主 */
export { marketPairs } from './marketPairs'

export type MarketTab = 'favorites' | 'market'

export const marketTabs: { id: MarketTab; label: string }[] = [
  { id: 'favorites', label: '自选' },
  { id: 'market', label: '行情' },
]

export type BottomTabId = 'home' | 'market' | 'trade' | 'assets'

export const supportedChains = ['BSC', 'TRC20'] as const

export function formatUsd(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatPrice(value: number): string {
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })
}

export function formatBalance(value: number, symbol: string): string {
  const decimals = symbol === 'USDT' ? 2 : symbol === 'TRX' ? 0 : 4
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toFixed(0)
}

export function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '−'
  return `${sign}${Math.abs(value).toFixed(2)}%`
}

export function getKycLabel(status: KycStatus): string {
  switch (status) {
    case 'verified':
      return '已认证'
    case 'pending':
      return '审核中'
    default:
      return '未认证'
  }
}

export function getKycBannerClassName(status: KycStatus): string {
  switch (status) {
    case 'verified':
      return 'border-success/30 bg-success-bg'
    case 'pending':
      return 'border-brand/30 bg-brand-muted'
    default:
      return 'border-brand/30 bg-brand-muted'
  }
}

export function getKycValueClassName(status: KycStatus): string {
  switch (status) {
    case 'verified':
      return 'text-success'
    case 'pending':
      return 'text-brand'
    default:
      return 'text-secondary'
  }
}

export function getKycBannerMessage(
  status: KycStatus,
  scene: 'withdraw' | 'account' = 'account',
): string {
  switch (status) {
    case 'verified':
      return scene === 'withdraw'
        ? '身份认证：已认证。您可正常提币。'
        : '身份认证：已认证。账户功能已全部解锁。'
    case 'pending':
      return '身份认证：审核中。完成 KYC 后可提币。'
    default:
      return '身份认证：未认证。完成 KYC 后可提币。'
  }
}
