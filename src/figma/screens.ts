import type { PendingOrder } from '../data/trade'
import { demoSpotOrders } from '../data/trade'
import type { WithdrawDraft } from '../data/wallet'
import type { FigmaScreenEntry } from './types'

const yellowBlack = { appTheme: 'yellow-black' as const, figmaExport: true }

const app = (preset: FigmaScreenEntry['preset']): FigmaScreenEntry['preset'] => ({
  previewPlatform: 'app',
  ...yellowBlack,
  ...preset,
})

const mockBuyOrder: PendingOrder = {
  pairId: 'btc',
  base: 'BTC',
  quote: 'USDT',
  side: 'buy',
  type: 'limit',
  price: 67_842.5,
  amount: 0.01,
  total: 678.425,
  fee: 0.678425,
}

const mockWithdrawDraft: WithdrawDraft = {
  coin: 'USDT',
  chain: 'TRC20',
  address: 'TXk3yP9n8vL2mR4qW6sH1jF5cD7bA9eG0x',
  amount: 100,
  fee: 1,
  receive: 99,
}

const mockSpotOrders = demoSpotOrders

const demoEmail = 'trader@example.com'

const tabScreens: FigmaScreenEntry[] = [
  {
    path: 'market/guest',
    label: '行情 · 游客',
    description: '黄黑 · 默认首页',
    group: 'tab',
    preset: app({ isLoggedIn: false, activeTab: 'market' }),
  },
  {
    path: 'market/logged-in',
    label: '行情 · 已登录',
    group: 'tab',
    preset: app({ isLoggedIn: true, activeTab: 'market' }),
  },
  {
    path: 'trade',
    label: '交易',
    group: 'tab',
    preset: app({ isLoggedIn: true, activeTab: 'trade' }),
  },
  {
    path: 'assets/guest',
    label: '资产 · 游客',
    group: 'tab',
    preset: app({ isLoggedIn: false, activeTab: 'assets' }),
  },
  {
    path: 'assets/logged-in',
    label: '资产 · 已登录',
    description: '已认证用户不展示 KYC 标签',
    group: 'tab',
    preset: app({ isLoggedIn: true, activeTab: 'assets', userKycStatus: 'verified' }),
  },
]

const authScreens: FigmaScreenEntry[] = [
  {
    path: 'auth/entry',
    label: '登录入口',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'entry' },
    }),
  },
  {
    path: 'auth/login',
    label: '登录',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'login' },
    }),
  },
  {
    path: 'auth/login-verify',
    label: '登录 · 验证码',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: {
        screen: 'login-verify',
        email: demoEmail,
        loginMethod: 'code',
      },
    }),
  },
  {
    path: 'auth/register',
    label: '注册',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'register' },
    }),
  },
  {
    path: 'auth/register-verify',
    label: '注册 · 验证码',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'register-verify', email: 'new@example.com' },
    }),
  },
  {
    path: 'auth/set-password',
    label: '注册 · 设置密码',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'register-password', email: 'new@example.com' },
    }),
  },
  {
    path: 'auth/security-verify',
    label: '安全验证',
    description: '登录 / 敏感操作二次验证',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'security-verify', email: demoEmail, flow: 'login' },
    }),
  },
  {
    path: 'auth/tg-connect',
    label: 'Telegram · 授权',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'tg-connect' },
    }),
  },
  {
    path: 'auth/tg-link',
    label: 'Telegram · 关联账户',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'tg-link' },
    }),
  },
]

const accountScreens: FigmaScreenEntry[] = [
  {
    path: 'account/settings',
    label: '账户设置',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'hub' },
    }),
  },
  {
    path: 'account/profile',
    label: '个人资料',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'profile' },
    }),
  },
  {
    path: 'account/security',
    label: '安全设置',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security' },
    }),
  },
  {
    path: 'account/security-google',
    label: 'Google 验证器',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-google' },
    }),
  },
  {
    path: 'account/security-email',
    label: '邮箱绑定',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-email' },
    }),
  },
  {
    path: 'account/security-login-password',
    label: '修改登录密码',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-login-password' },
    }),
  },
  {
    path: 'account/security-payment-password',
    label: '支付密码',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-payment-password' },
    }),
  },
  {
    path: 'account/kyc',
    label: '身份认证 · 未认证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'kyc' },
      userKycStatus: 'unverified',
    }),
  },
  {
    path: 'account/kyc-pending',
    label: '身份认证 · 审核中',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'kyc' },
      userKycStatus: 'pending',
    }),
  },
  {
    path: 'account/kyc-verified',
    label: '身份认证 · 已认证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'kyc' },
      userKycStatus: 'verified',
    }),
  },
  {
    path: 'account/kyc-sumsub',
    label: 'Sumsub 验证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'kyc-sumsub' },
    }),
  },
  {
    path: 'account/logout',
    label: '退出登录',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'logout' },
    }),
  },
  {
    path: 'account/delete',
    label: '注销账户',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'delete' },
    }),
  },
  {
    path: 'account/delete-verify',
    label: '注销 · 安全验证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'delete-verify' },
    }),
  },
  {
    path: 'account/delete-success',
    label: '注销成功',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'delete-success' },
    }),
  },
]

const walletScreens: FigmaScreenEntry[] = [
  {
    path: 'wallet/deposit',
    label: '充币',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit' },
    }),
  },
  {
    path: 'wallet/deposit-fetching',
    label: '充币 · 获取地址',
    description: '加载中状态',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit-fetching', coin: 'USDT', chain: 'TRC20' },
    }),
  },
  {
    path: 'wallet/deposit-address',
    label: '充币地址',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit-address', coin: 'USDT', chain: 'TRC20' },
    }),
  },
  {
    path: 'wallet/deposit-address-share',
    label: '充币地址 · 分享',
    description: '保存/分享卡片 Bottom Sheet',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit-address', coin: 'USDT', chain: 'TRC20' },
      walletOverlay: 'deposit-share',
    }),
  },
  {
    path: 'wallet/withdraw',
    label: '提币',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'withdraw' },
    }),
  },
  {
    path: 'wallet/withdraw-verify',
    label: '提币 · 安全验证',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'withdraw-verify', coin: 'USDT', chain: 'TRC20' },
      withdrawDraft: mockWithdrawDraft,
    }),
  },
  {
    path: 'wallet/withdraw-success',
    label: '提币成功',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'withdraw-success', coin: 'USDT', chain: 'TRC20' },
      withdrawDraft: mockWithdrawDraft,
    }),
  },
]

const recordsScreens: FigmaScreenEntry[] = [
  {
    path: 'records/fund',
    label: '充提记录',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      recordsScreen: { screen: 'fund' },
    }),
  },
  {
    path: 'records/fund-detail',
    label: '提现详情',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      recordsScreen: { screen: 'fund-detail', fundId: 'fund-003' },
    }),
  },
  {
    path: 'records/orders',
    label: '现货订单 · 历史委托',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      recordsScreen: { screen: 'orders' },
      orders: mockSpotOrders,
    }),
  },
  {
    path: 'records/order-detail',
    label: '订单详情',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      recordsScreen: { screen: 'order-detail', orderId: 'ord-pop-1' },
      orders: mockSpotOrders,
    }),
  },
]

const supportScreens: FigmaScreenEntry[] = [
  {
    path: 'support/help',
    label: '帮助中心',
    group: 'support',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      supportScreen: { screen: 'help' },
    }),
  },
  {
    path: 'support/help-article',
    label: '帮助文章',
    description: '常见问题',
    group: 'support',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      supportScreen: { screen: 'help-article', articleId: 'faq' },
    }),
  },
  {
    path: 'support/center',
    label: '联系客服',
    group: 'support',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      supportScreen: { screen: 'support' },
    }),
  },
  {
    path: 'support/chat',
    label: '在线客服',
    group: 'support',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      supportScreen: { screen: 'support-chat' },
    }),
  },
]

const chartScreens: FigmaScreenEntry[] = [
  {
    path: 'chart/kline',
    label: 'K 线',
    group: 'chart',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      chartScreen: { pairId: 'btc' },
    }),
  },
]

const overlayScreens: FigmaScreenEntry[] = [
  {
    path: 'overlay/sheet-language',
    label: 'Bottom Sheet · 语言',
    description: '设置选择器',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      activeSheet: 'language',
    }),
  },
  {
    path: 'overlay/sheet-fiat',
    label: 'Bottom Sheet · 法币',
    description: '设置选择器',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      activeSheet: 'fiat',
    }),
  },
  {
    path: 'overlay/sheet-pair-picker',
    label: 'Bottom Sheet · 交易对',
    description: '列表选择 + 搜索',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      tradeSheet: 'pair-picker',
    }),
  },
  {
    path: 'overlay/sheet-order-book-depth',
    label: 'Bottom Sheet · 盘口精度',
    description: '深度档位选择',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      tradeOverlay: 'order-book-depth',
    }),
  },
  {
    path: 'overlay/sheet-order-confirm',
    label: 'Bottom Sheet · 下单确认',
    description: '确认单 + 买卖 CTA',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      tradeSheet: 'confirm',
      pendingOrder: mockBuyOrder,
    }),
  },
  {
    path: 'overlay/sheet-add-favorite',
    label: 'Bottom Sheet · 添加自选',
    description: '列表选择',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      tradeSheet: 'add-favorite',
    }),
  },
  {
    path: 'overlay/alert-compliance',
    label: 'Alert Dialog · 地区限制',
    description: '合规阻断，不可点遮罩关闭',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      showComplianceRestriction: true,
    }),
  },
  {
    path: 'overlay/toast-success',
    label: 'Toast · 成功',
    description: '3s 自动消失',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      figmaToast: { variant: 'success', message: '已复制 UID' },
    }),
  },
  {
    path: 'overlay/toast-error',
    label: 'Toast · 错误',
    description: '5s，可手动关闭',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      figmaToast: { variant: 'error', message: '下单失败，请检查网络后重试' },
    }),
  },
  {
    path: 'overlay/toast-warning',
    label: 'Toast · 警告',
    description: '4s，可手动关闭',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      figmaToast: { variant: 'warning', message: '滑点较大，请确认价格后下单' },
    }),
  },
  {
    path: 'overlay/toast-info',
    label: 'Toast · 提示',
    description: '3s 自动消失',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      figmaToast: { variant: 'info', message: '行情数据每 3 秒更新' },
    }),
  },
]

/** @deprecated 使用 overlay/alert-compliance */
const legacyScreens: FigmaScreenEntry[] = [
  {
    path: 'compliance/restriction',
    label: '地区限制弹窗（旧路径）',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      showComplianceRestriction: true,
    }),
  },
]

export const figmaScreens: FigmaScreenEntry[] = [
  ...tabScreens,
  ...authScreens,
  ...accountScreens,
  ...walletScreens,
  ...recordsScreens,
  ...supportScreens,
  ...chartScreens,
  ...overlayScreens,
  ...legacyScreens,
]

export const figmaScreenGroups = [
  { id: 'tab' as const, title: '主 Tab' },
  { id: 'auth' as const, title: '登录注册' },
  { id: 'account' as const, title: '账户设置' },
  { id: 'wallet' as const, title: '充提' },
  { id: 'records' as const, title: '记录' },
  { id: 'support' as const, title: '帮助与客服' },
  { id: 'chart' as const, title: '行情详情' },
  { id: 'overlay' as const, title: 'Toast / 弹窗 / Bottom Sheet' },
]

const screenByPath = new Map(figmaScreens.map((s) => [s.path, s]))

export function getFigmaScreen(path: string): FigmaScreenEntry | undefined {
  return screenByPath.get(path.replace(/^\/+|\/+$/g, ''))
}
