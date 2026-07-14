import type { PendingOrder } from '../data/trade'
import { demoSpotOrders } from '../data/trade'
import type { WithdrawDraft } from '../data/wallet'
import type { FigmaScreenEntry, FigmaScreenGroup, MobileFigmaScreenGroup } from './types'

const yellowBlack = { appTheme: 'yellow-black' as const, figmaExport: true }

const app = (preset: FigmaScreenEntry['preset']): FigmaScreenEntry['preset'] => ({
  previewPlatform: 'app',
  ...yellowBlack,
  ...preset,
})

const pc = (preset: FigmaScreenEntry['preset']): FigmaScreenEntry['preset'] => ({
  previewPlatform: 'pc',
  ...yellowBlack,
  ...preset,
})

const h5 = (preset: FigmaScreenEntry['preset']): FigmaScreenEntry['preset'] => ({
  previewPlatform: 'h5',
  ...yellowBlack,
  ...preset,
})

type MobileScreenDef = {
  path: string
  label: string
  description?: string
  group: MobileFigmaScreenGroup
  preset: FigmaScreenEntry['preset']
}

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
const demoInviteCode = 'CN8888'

const tabScreens: MobileScreenDef[] = [
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
    path: 'market/logged-in-contract',
    label: '行情 · 已登录 · 合约',
    description: '现货 / 合约切换 · 永续列表',
    group: 'tab',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      productModule: 'contract',
    }),
  },
  {
    path: 'trade',
    label: '交易',
    group: 'tab',
    preset: app({ isLoggedIn: true, activeTab: 'trade' }),
  },
  {
    path: 'trade/contract',
    label: '交易 · 合约',
    description: '开多 / 开空 · 杠杆与盘口',
    group: 'tab',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      productModule: 'contract',
      selectedPairId: 'perp-btc',
    }),
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
  {
    path: 'assets/logged-in-contract',
    label: '资产 · 已登录 · 合约',
    description: '合约权益、保证金与持仓',
    group: 'tab',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      productModule: 'contract',
    }),
  },
]

const authScreens: MobileScreenDef[] = [
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
    path: 'auth/register-invite',
    label: '注册 · 邀请码',
    description: '邀请码选填',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: { screen: 'register', inviteCode: demoInviteCode },
    }),
  },
  {
    path: 'auth/register-verify',
    label: '注册 · 验证码',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: {
        screen: 'register-verify',
        email: 'new@example.com',
        inviteCode: demoInviteCode,
      },
    }),
  },
  {
    path: 'auth/set-password',
    label: '注册 · 设置密码',
    group: 'auth',
    preset: app({
      isLoggedIn: false,
      activeTab: 'market',
      authScreen: {
        screen: 'register-password',
        email: 'new@example.com',
        inviteCode: demoInviteCode,
      },
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

const accountScreens: MobileScreenDef[] = [
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
    path: 'account/invite',
    label: '邀请好友',
    description: '邀请码、邀请链接与返佣规则',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'invite' },
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
      userGoogleAuthBound: true,
      accountScreen: { screen: 'security-google' },
    }),
  },
  {
    path: 'account/security-google-unbound',
    label: 'Google 验证器 · 未绑定',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google' },
    }),
  },
  {
    path: 'account/security-google-setup',
    label: 'Google 验证器 · 绑定步骤',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google-setup' },
    }),
  },
  {
    path: 'account/security-google-verify',
    label: 'Google 验证器 · 安全验证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google-verify' },
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
    path: 'account/security-anti-phishing',
    label: '防钓鱼码 · 介绍',
    description: '未设置时展示说明与创建入口',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-anti-phishing' },
      userAntiPhishingCode: null,
    }),
  },
  {
    path: 'account/security-anti-phishing-set',
    label: '防钓鱼码 · 已设置',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-anti-phishing' },
      userAntiPhishingCode: '12NovaA',
    }),
  },
  {
    path: 'account/security-anti-phishing-how-it-works',
    label: '防钓鱼码 · 如何运作',
    description: '已设置页点击说明后的 Bottom Sheet',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-anti-phishing' },
      userAntiPhishingCode: '12NovaA',
      antiPhishingOverlay: 'how-it-works',
    }),
  },
  {
    path: 'account/security-anti-phishing-create',
    label: '防钓鱼码 · 创建',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: {
        screen: 'security-anti-phishing-form',
        antiPhishingMode: 'create',
      },
    }),
  },
  {
    path: 'account/security-anti-phishing-change',
    label: '防钓鱼码 · 更改',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: {
        screen: 'security-anti-phishing-form',
        antiPhishingMode: 'change',
      },
      userAntiPhishingCode: '12NovaA',
    }),
  },
  {
    path: 'account/security-anti-phishing-verify',
    label: '防钓鱼码 · 安全验证',
    group: 'account',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      accountScreen: { screen: 'security-anti-phishing-verify' },
      antiPhishingDraft: '12NovaA',
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

const walletScreens: MobileScreenDef[] = [
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
    path: 'wallet/deposit-save-success',
    label: '充币 · 保存成功',
    description: '保存到相册后的图片内容预览',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit-save-success', coin: 'USDT', chain: 'TRC20' },
    }),
  },
  {
    path: 'wallet/withdraw',
    label: '提币',
    description: '未设支付密码时引导前往设置',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'withdraw' },
    }),
  },
  {
    path: 'wallet/transfer',
    label: '划转',
    description: '资金账户与现货账户互转',
    group: 'wallet',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'transfer' },
    }),
  },
  {
    path: 'wallet/withdraw-verify',
    label: '提币 · 支付密码验证',
    description: '资金操作改为支付密码校验',
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

const recordsScreens: MobileScreenDef[] = [
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
    label: '提币详情',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      recordsScreen: { screen: 'fund-detail', fundId: 'fund-003' },
    }),
  },
  {
    path: 'records/deposit-detail',
    label: '充币详情',
    description: '链上充值到账记录',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      recordsScreen: { screen: 'deposit-detail', fundId: 'fund-001' },
    }),
  },
  {
    path: 'records/deposit-detail-pending',
    label: '充币详情 · 确认中',
    group: 'records',
    preset: app({
      isLoggedIn: true,
      activeTab: 'assets',
      recordsScreen: { screen: 'deposit-detail', fundId: 'fund-002' },
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

const supportScreens: MobileScreenDef[] = [
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

const chartScreens: MobileScreenDef[] = [
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

const overlayScreens: MobileScreenDef[] = [
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
    path: 'overlay/alert-version-force',
    label: 'Alert Dialog · 强制更新',
    description: '不可关闭，必须更新后才能继续使用',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      showVersionUpdate: 'force',
    }),
  },
  {
    path: 'overlay/alert-version-soft',
    label: 'Alert Dialog · 弱更新',
    description: '可稍后提醒，支持关闭',
    group: 'overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'market',
      showVersionUpdate: 'soft',
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

const pcScreens: FigmaScreenEntry[] = [
  {
    path: 'pc/home',
    label: 'PC · 首页',
    description: '1440×900 · 落地页',
    group: 'pc',
    preset: pc({ isLoggedIn: false, activeTab: 'home' }),
  },
  {
    path: 'pc/market',
    label: 'PC · 行情',
    group: 'pc',
    preset: pc({ isLoggedIn: true, activeTab: 'market' }),
  },
  {
    path: 'pc/trade',
    label: 'PC · 交易',
    description: '图表 · 盘口 · 下单',
    group: 'pc',
    preset: pc({ isLoggedIn: true, activeTab: 'trade', figmaPcViewport: 'fixed' }),
  },
  {
    path: 'pc/assets',
    label: 'PC · 资产中心',
    description: '个人中心与资产合并',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
    }),
  },
  {
    path: 'pc/account/invite',
    label: 'PC · 邀请好友弹窗',
    description: '邀请码、邀请链接与返佣规则',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountScreen: { screen: 'invite' },
    }),
  },
  {
    path: 'pc/account/kyc',
    label: 'PC · 身份认证弹窗 · 未认证',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'unverified',
      accountScreen: { screen: 'kyc' },
    }),
  },
  {
    path: 'pc/account/kyc-pending',
    label: 'PC · 身份认证弹窗 · 审核中',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'pending',
      accountScreen: { screen: 'kyc' },
    }),
  },
  {
    path: 'pc/account/kyc-verified',
    label: 'PC · 身份认证弹窗 · 已认证',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountScreen: { screen: 'kyc' },
    }),
  },
  {
    path: 'pc/account/kyc-sumsub',
    label: 'PC · Sumsub 验证弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'unverified',
      accountScreen: { screen: 'kyc-sumsub' },
    }),
  },
  {
    path: 'pc/assets/security',
    label: 'PC · 安全设置弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountOverlay: 'security',
    }),
  },
  {
    path: 'pc/account/security-google-unbound',
    label: 'PC · Google 验证器 · 未绑定弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google' },
    }),
  },
  {
    path: 'pc/account/security-google-setup',
    label: 'PC · Google 验证器 · 绑定步骤弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google-setup' },
    }),
  },
  {
    path: 'pc/account/security-google-verify',
    label: 'PC · Google 验证器 · 安全验证弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      userGoogleAuthBound: false,
      accountScreen: { screen: 'security-google-verify' },
    }),
  },
  {
    path: 'pc/account/security-email',
    label: 'PC · 邮箱弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountScreen: { screen: 'security-email' },
    }),
  },
  {
    path: 'pc/account/security-login-password',
    label: 'PC · 修改登录密码弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountScreen: { screen: 'security-login-password' },
    }),
  },
  {
    path: 'pc/account/security-payment-password',
    label: 'PC · 设置支付密码弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      userPaymentPasswordSet: false,
      accountScreen: { screen: 'security-payment-password' },
    }),
  },
  {
    path: 'pc/assets/logout',
    label: 'PC · 退出登录弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountOverlay: 'logout',
    }),
  },
  {
    path: 'pc/assets/delete',
    label: 'PC · 注销账户弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      accountOverlay: 'delete',
    }),
  },
  {
    path: 'pc/auth/login',
    label: 'PC · 登录',
    description: '左右分栏',
    group: 'pc',
    preset: pc({
      isLoggedIn: false,
      activeTab: 'home',
      authScreen: { screen: 'login' },
    }),
  },
  {
    path: 'pc/auth/register',
    label: 'PC · 注册',
    description: '左右分栏',
    group: 'pc',
    preset: pc({
      isLoggedIn: false,
      activeTab: 'home',
      authScreen: { screen: 'register' },
    }),
  },
  {
    path: 'pc/auth/register-invite',
    label: 'PC · 注册 · 邀请码',
    description: '邀请码选填',
    group: 'pc',
    preset: pc({
      isLoggedIn: false,
      activeTab: 'home',
      authScreen: { screen: 'register', inviteCode: demoInviteCode },
    }),
  },
  {
    path: 'pc/wallet/deposit',
    label: 'PC · 充币弹窗',
    description: '三步流程 · 选资产 / 网络 / 地址',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'deposit-address', coin: 'USDT', chain: 'BEP20' },
    }),
  },
  {
    path: 'pc/wallet/withdraw',
    label: 'PC · 提币弹窗',
    description: '未设支付密码时引导前往设置',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      walletScreen: { screen: 'withdraw' },
    }),
  },
  {
    path: 'pc/wallet/withdraw-verify',
    label: 'PC · 提币 · 支付密码验证弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userPaymentPasswordSet: true,
      walletScreen: { screen: 'withdraw-verify', coin: 'USDT', chain: 'TRC20' },
      withdrawDraft: mockWithdrawDraft,
    }),
  },
  {
    path: 'pc/records/fund',
    label: 'PC · 充提记录弹窗',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'assets',
      userKycStatus: 'verified',
      recordsScreen: { screen: 'fund' },
    }),
  },
  {
    path: 'pc/overlay/sheet-fiat',
    label: 'PC · 法币设置',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'trade',
      activeSheet: 'fiat',
      figmaPcViewport: 'fixed',
    }),
  },
  {
    path: 'pc/overlay/sheet-pair-picker',
    label: 'PC · 交易对选择',
    description: '含搜索',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'trade',
      tradeSheet: 'pair-picker',
      figmaPcViewport: 'fixed',
    }),
  },
  {
    path: 'pc/overlay/sheet-order-book-depth',
    label: 'PC · 盘口深度',
    group: 'pc',
    preset: pc({
      isLoggedIn: true,
      activeTab: 'trade',
      tradeOverlay: 'order-book-depth',
      figmaPcViewport: 'fixed',
    }),
  },
]

/** @deprecated 使用 app/overlay/alert-compliance */
const legacyScreens: FigmaScreenEntry[] = [
  {
    path: 'compliance/restriction',
    label: '地区限制弹窗（旧路径）',
    group: 'app-overlay',
    preset: app({
      isLoggedIn: true,
      activeTab: 'trade',
      showComplianceRestriction: true,
    }),
  },
]

const mobileScreens: MobileScreenDef[] = [
  ...tabScreens,
  ...authScreens,
  ...accountScreens,
  ...walletScreens,
  ...recordsScreens,
  ...supportScreens,
  ...chartScreens,
  ...overlayScreens,
]

function stripExportMeta(preset: FigmaScreenEntry['preset']): FigmaScreenEntry['preset'] {
  const { previewPlatform, appTheme, figmaExport, ...rest } = preset
  return rest
}

function expandPlatformScreens(
  screens: MobileScreenDef[],
  platform: 'app' | 'h5',
): FigmaScreenEntry[] {
  const wrap = platform === 'app' ? app : h5
  const tag = platform === 'app' ? 'APP' : 'H5'

  return screens.map((screen) => ({
    path: `${platform}/${screen.path}`,
    label: `${tag} · ${screen.label}`,
    description: screen.description,
    group: `${platform}-${screen.group}` as FigmaScreenGroup,
    preset: wrap(stripExportMeta(screen.preset)),
  }))
}

const appScreens = expandPlatformScreens(mobileScreens, 'app')
const h5Screens = expandPlatformScreens(mobileScreens, 'h5')

const legacyPathAliases = new Map<string, string>([
  ['compliance/restriction', 'app/overlay/alert-compliance'],
  ...mobileScreens.map((screen) => [screen.path, `app/${screen.path}`] as const),
])

export const figmaScreens: FigmaScreenEntry[] = [
  ...pcScreens,
  ...appScreens,
  ...h5Screens,
  ...legacyScreens,
]

const mobileGroupTitles: Record<MobileFigmaScreenGroup, string> = {
  tab: '主 Tab',
  auth: '登录注册',
  account: '账户设置',
  wallet: '充提',
  records: '记录',
  support: '帮助与客服',
  chart: '行情详情',
  overlay: 'Toast / 弹窗 / Bottom Sheet',
}

export const figmaScreenGroups = [
  { id: 'pc' as const, title: 'PC 端 (1440×900)' },
  ...(['app', 'h5'] as const).flatMap((platform) =>
    (Object.keys(mobileGroupTitles) as MobileFigmaScreenGroup[]).map((group) => ({
      id: `${platform}-${group}` as FigmaScreenGroup,
      title:
        platform === 'app'
          ? `APP 端 (390×812) · ${mobileGroupTitles[group]}`
          : `H5 端 (390×856) · ${mobileGroupTitles[group]}`,
    })),
  ),
]

const screenByPath = new Map(figmaScreens.map((s) => [s.path, s]))

export function getFigmaScreen(path: string): FigmaScreenEntry | undefined {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  return (
    screenByPath.get(normalized) ??
    screenByPath.get(legacyPathAliases.get(normalized) ?? '')
  )
}
