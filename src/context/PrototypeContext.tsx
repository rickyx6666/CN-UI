import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AccountScreenState } from '../data/account'
import type { AntiPhishingDemoScene } from '../data/antiPhishing'
import type { AuthScreenState } from '../data/auth'
import { marketPairs } from '../data/mock'
import type { ComplianceRestrictionOptions } from '../data/compliance'
import {
  defaultVersionUpdateInfo,
  type VersionUpdateInfo,
  type VersionUpdateVariant,
} from '../data/versionUpdate'
import type { SettingsSheet } from '../data/settings'
import {
  applyMarketFill,
  cloneDemoSpotOrders,
  defaultSpotBalances,
  freezeForLimitOrder,
  unfreezeLimitOrder,
  type PendingOrder,
  type SpotBalance,
  type SpotOrder,
  type TradeSheet,
} from '../data/trade'
import { orderSuccessToastMessage } from '../data/feedback'
import type { FundRecord, RecordsScreenState } from '../data/records'
import { mockFundRecords } from '../data/records'
import type { SupportScreenState } from '../data/support'
import {
  depositKey,
  getDepositNetworksForCoin,
  type WalletCoin,
  type WalletNetwork,
  type WalletScreenState,
  type WithdrawDraft,
} from '../data/wallet'
import type { BottomTabId, KycStatus, UserProfile } from '../data/mock'
import type { ChartScreenState } from '../data/kline'
import type { PreviewPlatform } from '../data/platform'
import { loadAppTheme, saveAppTheme, type AppTheme } from '../data/appTheme'
import type { PrototypePreset, FigmaToastPreset } from '../figma/types'
import type { AppToastState, ToastVariant } from '../data/feedback'
import type { ProductModule } from '../data/productModule'
import { isContractPairId } from '../data/productModule'

interface PrototypeContextValue {
  isLoggedIn: boolean
  setLoggedIn: (value: boolean) => void
  activeTab: BottomTabId
  setActiveTab: (tab: BottomTabId) => void
  productModule: ProductModule
  setProductModule: (module: ProductModule) => void
  user: UserProfile
  updateProfile: (patch: Partial<Omit<UserProfile, 'isLoggedIn'>>) => void
  locale: string
  setLocale: (id: string) => void
  fiat: string
  setFiat: (id: string) => void
  activeSheet: SettingsSheet
  openSheet: (sheet: SettingsSheet) => void
  closeSheet: () => void
  authScreen: AuthScreenState | null
  openLogin: () => void
  openRegister: () => void
  openAuth: () => void
  closeAuth: () => void
  setAuthScreen: (screen: AuthScreenState | null) => void
  completeAuth: () => void
  accountScreen: AccountScreenState | null
  openAccount: () => void
  closeAccount: () => void
  navigateAccount: (screen: AccountScreenState) => void
  logout: () => void
  deleteAccount: () => void
  selectedPairId: string
  selectPair: (pairId: string) => void
  openTrade: (pairId?: string) => void
  spotBalances: SpotBalance[]
  orders: SpotOrder[]
  pendingOrder: PendingOrder | null
  tradeSheet: TradeSheet
  submitOrder: (order: PendingOrder) => void
  confirmOrder: () => void
  cancelPendingOrder: () => void
  cancelOrder: (orderId: string) => void
  cancelAllOpenOrders: () => void
  openTradeSheet: (sheet: TradeSheet) => void
  closeTradeSheet: () => void
  favoritePairIds: string[]
  toggleFavorite: (pairId: string) => void
  isFavorite: (pairId: string) => boolean
  addFavorite: (pairId: string) => void
  quickAddFavorite: () => void
  showComplianceRestriction: boolean
  complianceModule: string | null
  openComplianceRestriction: (options?: ComplianceRestrictionOptions) => void
  closeComplianceRestriction: () => void
  versionUpdateVariant: VersionUpdateVariant | null
  versionUpdateInfo: VersionUpdateInfo
  openVersionUpdate: (
    variant: VersionUpdateVariant,
    info?: Partial<VersionUpdateInfo>,
  ) => void
  closeVersionUpdate: () => void
  walletScreen: WalletScreenState | null
  withdrawDraft: WithdrawDraft | null
  antiPhishingDraft: string | null
  setAntiPhishingDraft: (code: string | null) => void
  antiPhishingOverlay: 'how-it-works' | null
  clearAntiPhishingOverlay: () => void
  openAntiPhishingDemo: (scene: AntiPhishingDemoScene) => void
  openWallet: (
    flow: 'deposit' | 'withdraw' | 'transfer',
    options?: { coin?: WalletCoin },
  ) => void
  closeWallet: () => void
  navigateWallet: (screen: WalletScreenState) => void
  setWithdrawDraft: (draft: WithdrawDraft | null) => void
  activatedDepositKeys: string[]
  isDepositActivated: (coin: WalletCoin, chain: WalletNetwork) => boolean
  activateDeposit: (coin: WalletCoin, chain: WalletNetwork) => void
  supportScreen: SupportScreenState | null
  openHelpCenter: () => void
  openSupportCenter: () => void
  closeSupport: () => void
  navigateSupport: (screen: SupportScreenState) => void
  recordsScreen: RecordsScreenState | null
  fundRecords: FundRecord[]
  openFundHistory: () => void
  openOrderHistory: () => void
  closeRecords: () => void
  navigateRecords: (screen: RecordsScreenState) => void
  addFundRecord: (record: FundRecord) => void
  previewPlatform: PreviewPlatform
  setPreviewPlatform: (platform: PreviewPlatform) => void
  appTheme: AppTheme
  setAppTheme: (theme: AppTheme) => void
  chartScreen: ChartScreenState | null
  openKline: (pairId?: string) => void
  closeKline: () => void
  figmaToast: FigmaToastPreset | null
  figmaExport: boolean
  figmaPcViewport: 'fixed' | 'document'
  figmaWalletOverlay: 'deposit-share' | null
  figmaAntiPhishingOverlay: 'how-it-works' | null
  figmaTradeOverlay: 'order-book-depth' | null
  figmaAccountOverlay: 'security' | 'logout' | 'delete' | null
  toast: AppToastState | null
  showToast: (message: string, variant?: ToastVariant) => void
  dismissToast: () => void
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null)

const loggedInProfileDefaults: Omit<UserProfile, 'isLoggedIn'> = {
  uid: '1002486391',
  nickname: 'Trader',
  email: 'trader@example.com',
  bio: '',
  kycStatus: 'pending' satisfies KycStatus,
  googleAuthBound: true,
  paymentPasswordSet: false,
  antiPhishingCode: null,
}

const guestProfile: UserProfile = {
  isLoggedIn: false,
  uid: '',
  nickname: '',
  email: '',
  bio: '',
  kycStatus: 'unverified',
  googleAuthBound: false,
  paymentPasswordSet: false,
  antiPhishingCode: null,
}

function createOrderId() {
  return `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const defaultFavoriteIds = marketPairs
  .filter((p) => p.isFavorite)
  .map((p) => p.id)

export function PrototypeProvider({
  children,
  preset,
}: {
  children: ReactNode
  preset?: PrototypePreset
}) {
  const [isLoggedIn, setLoggedIn] = useState(preset?.isLoggedIn ?? false)
  const [profile, setProfile] = useState({
    ...loggedInProfileDefaults,
    ...(preset?.userKycStatus ? { kycStatus: preset.userKycStatus } : {}),
    ...(preset?.userGoogleAuthBound !== undefined
      ? { googleAuthBound: preset.userGoogleAuthBound }
      : {}),
    ...(preset?.userPaymentPasswordSet !== undefined
      ? { paymentPasswordSet: preset.userPaymentPasswordSet }
      : {}),
    ...(preset?.userAntiPhishingCode !== undefined
      ? { antiPhishingCode: preset.userAntiPhishingCode }
      : {}),
  })
  const [activeTab, setActiveTab] = useState<BottomTabId>(preset?.activeTab ?? 'market')
  const [productModule, setProductModule] = useState<ProductModule>(
    preset?.productModule ?? 'spot',
  )
  const [authScreen, setAuthScreen] = useState<AuthScreenState | null>(
    preset?.authScreen ?? null,
  )
  const [accountScreen, setAccountScreen] = useState<AccountScreenState | null>(
    preset?.accountScreen ?? null,
  )
  const [locale, setLocale] = useState('zh-CN')
  const [fiat, setFiat] = useState('USD')
  const [activeSheet, setActiveSheet] = useState<SettingsSheet>(preset?.activeSheet ?? null)
  const [selectedPairId, setSelectedPairId] = useState(
    preset?.selectedPairId ?? marketPairs[0].id,
  )
  const [spotBalances, setSpotBalances] = useState<SpotBalance[]>(
    defaultSpotBalances.map((b) => ({ ...b })),
  )
  const [orders, setOrders] = useState<SpotOrder[]>(
    preset?.orders ?? cloneDemoSpotOrders(),
  )
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(
    preset?.pendingOrder ?? null,
  )
  const [tradeSheet, setTradeSheet] = useState<TradeSheet>(preset?.tradeSheet ?? null)
  const [favoritePairIds, setFavoritePairIds] =
    useState<string[]>(defaultFavoriteIds)
  const [showComplianceRestriction, setShowComplianceRestriction] =
    useState(preset?.showComplianceRestriction ?? false)
  const [complianceModule, setComplianceModule] = useState<string | null>(null)
  const [versionUpdateVariant, setVersionUpdateVariant] =
    useState<VersionUpdateVariant | null>(preset?.showVersionUpdate ?? null)
  const [versionUpdateInfo, setVersionUpdateInfo] = useState<VersionUpdateInfo>(
    () => ({ ...defaultVersionUpdateInfo }),
  )
  const [walletScreen, setWalletScreen] = useState<WalletScreenState | null>(
    preset?.walletScreen ?? null,
  )
  const [withdrawDraft, setWithdrawDraft] = useState<WithdrawDraft | null>(
    preset?.withdrawDraft ?? null,
  )
  const [antiPhishingDraft, setAntiPhishingDraft] = useState<string | null>(
    preset?.antiPhishingDraft ?? null,
  )
  const [antiPhishingOverlay, setAntiPhishingOverlay] = useState<
    'how-it-works' | null
  >(preset?.antiPhishingOverlay ?? null)
  const [supportScreen, setSupportScreen] = useState<SupportScreenState | null>(
    preset?.supportScreen ?? null,
  )
  const [recordsScreen, setRecordsScreen] = useState<RecordsScreenState | null>(
    preset?.recordsScreen ?? null,
  )
  const [fundRecords, setFundRecords] = useState<FundRecord[]>(
    () => mockFundRecords.map((r) => ({ ...r })),
  )
  const [activatedDepositKeys, setActivatedDepositKeys] = useState<string[]>([])
  const [previewPlatform, setPreviewPlatformState] = useState<PreviewPlatform>(
    preset?.previewPlatform ?? 'app',
  )
  const [appTheme, setAppThemeState] = useState<AppTheme>(
    preset?.appTheme ?? loadAppTheme(),
  )
  const [chartScreen, setChartScreen] = useState<ChartScreenState | null>(
    preset?.chartScreen ?? null,
  )
  const figmaToast = preset?.figmaToast ?? null
  const figmaExport = preset?.figmaExport ?? false
  const figmaPcViewport = preset?.figmaPcViewport ?? 'document'
  const figmaWalletOverlay = preset?.walletOverlay ?? null
  const figmaAntiPhishingOverlay = preset?.antiPhishingOverlay ?? null
  const figmaTradeOverlay = preset?.tradeOverlay ?? null
  const figmaAccountOverlay = preset?.accountOverlay ?? null
  const [toast, setToast] = useState<AppToastState | null>(null)

  const user = isLoggedIn
    ? { ...profile, isLoggedIn: true as const }
    : guestProfile

  const resetTradeState = useCallback(() => {
    setSpotBalances(defaultSpotBalances.map((b) => ({ ...b })))
    setOrders(cloneDemoSpotOrders())
    setPendingOrder(null)
    setTradeSheet(null)
    setSelectedPairId(marketPairs[0].id)
    setFavoritePairIds(defaultFavoriteIds)
    setWalletScreen(null)
    setWithdrawDraft(null)
    setSupportScreen(null)
    setRecordsScreen(null)
    setFundRecords(mockFundRecords.map((r) => ({ ...r })))
    setActivatedDepositKeys([])
    setChartScreen(null)
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Omit<UserProfile, 'isLoggedIn'>>) => {
      setProfile((prev) => ({ ...prev, ...patch }))
    },
    [],
  )

  const openSheet = useCallback((sheet: SettingsSheet) => {
    setActiveSheet(sheet)
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  const openLogin = useCallback(() => {
    setAuthScreen({ screen: 'login' })
  }, [])

  const openRegister = useCallback(() => {
    setAuthScreen({ screen: 'register' })
  }, [])

  const openAuth = useCallback(() => {
    if (previewPlatform === 'h5') {
      setAuthScreen({ screen: 'tg-connect' })
    } else {
      setAuthScreen({ screen: 'entry' })
    }
  }, [previewPlatform])

  const closeAuth = useCallback(() => {
    setAuthScreen(null)
  }, [])

  const completeAuth = useCallback(() => {
    setLoggedIn(true)
    setAuthScreen(null)
  }, [])

  const openAccount = useCallback(() => {
    setAccountScreen({ screen: 'hub' })
  }, [])

  const closeAccount = useCallback(() => {
    setAccountScreen(null)
  }, [])

  const navigateAccount = useCallback((screen: AccountScreenState) => {
    setAccountScreen(screen)
  }, [])

  const clearAntiPhishingOverlay = useCallback(() => {
    setAntiPhishingOverlay(null)
  }, [])

  const openAntiPhishingDemo = useCallback(
    (scene: AntiPhishingDemoScene) => {
      setLoggedIn(true)
      setAuthScreen(null)
      setAntiPhishingOverlay(null)
      setAntiPhishingDraft(null)

      switch (scene) {
        case 'intro':
          setProfile((prev) => ({ ...prev, antiPhishingCode: null }))
          setAccountScreen({ screen: 'security-anti-phishing' })
          break
        case 'set':
          setProfile((prev) => ({ ...prev, antiPhishingCode: '12NovaA' }))
          setAccountScreen({ screen: 'security-anti-phishing' })
          break
        case 'how-it-works':
          setProfile((prev) => ({ ...prev, antiPhishingCode: '12NovaA' }))
          setAntiPhishingOverlay('how-it-works')
          setAccountScreen({ screen: 'security-anti-phishing' })
          break
        case 'create':
          setProfile((prev) => ({ ...prev, antiPhishingCode: null }))
          setAccountScreen({
            screen: 'security-anti-phishing-form',
            antiPhishingMode: 'create',
          })
          break
        case 'change':
          setProfile((prev) => ({ ...prev, antiPhishingCode: '12NovaA' }))
          setAccountScreen({
            screen: 'security-anti-phishing-form',
            antiPhishingMode: 'change',
          })
          break
        case 'verify':
          setProfile((prev) => ({ ...prev, antiPhishingCode: '12NovaA' }))
          setAntiPhishingDraft('12NovaB')
          setAccountScreen({ screen: 'security-anti-phishing-verify' })
          break
      }
    },
    [],
  )

  const logout = useCallback(() => {
    setLoggedIn(false)
    setAccountScreen(null)
    setAuthScreen(null)
    setProfile(loggedInProfileDefaults)
    resetTradeState()
  }, [resetTradeState])

  const deleteAccount = useCallback(() => {
    setLoggedIn(false)
    setAccountScreen(null)
    setAuthScreen(null)
    setProfile(loggedInProfileDefaults)
    resetTradeState()
  }, [resetTradeState])

  const selectPair = useCallback((pairId: string) => {
    setSelectedPairId(pairId)
  }, [])

  const openTrade = useCallback((pairId?: string) => {
    if (pairId) {
      setSelectedPairId(pairId)
      setProductModule(isContractPairId(pairId) ? 'contract' : 'spot')
    }
    setActiveTab('trade')
  }, [])

  const openTradeSheet = useCallback((sheet: TradeSheet) => {
    setTradeSheet(sheet)
  }, [])

  const closeTradeSheet = useCallback(() => {
    setTradeSheet(null)
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ message, variant })
  }, [])

  const submitOrder = useCallback((order: PendingOrder) => {
    setPendingOrder(order)
    setTradeSheet('confirm')
  }, [])

  const cancelPendingOrder = useCallback(() => {
    setPendingOrder(null)
    setTradeSheet(null)
  }, [])

  const confirmOrder = useCallback(() => {
    if (!pendingOrder) return

    const spotOrder: SpotOrder = {
      id: createOrderId(),
      pairId: pendingOrder.pairId,
      base: pendingOrder.base,
      quote: pendingOrder.quote,
      side: pendingOrder.side,
      type: pendingOrder.type,
      price: pendingOrder.price,
      amount: pendingOrder.amount,
      filled: pendingOrder.type === 'market' ? pendingOrder.amount : 0,
      total: pendingOrder.total,
      fee: pendingOrder.fee,
      status: pendingOrder.type === 'market' ? 'filled' : 'open',
      createdAt: Date.now(),
    }

    if (pendingOrder.type === 'market') {
      setSpotBalances((prev) => applyMarketFill(prev, spotOrder))
    } else {
      setSpotBalances((prev) => freezeForLimitOrder(prev, pendingOrder))
    }

    setOrders((prev) => [spotOrder, ...prev])
    setPendingOrder(null)
    setTradeSheet(null)
    showToast(orderSuccessToastMessage())
  }, [pendingOrder, showToast])

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId && o.status === 'open')
      if (!target) return prev

      setSpotBalances((balances) => unfreezeLimitOrder(balances, target))

      return prev.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as const } : o,
      )
    })
  }, [])

  const cancelAllOpenOrders = useCallback(() => {
    setOrders((prev) => {
      const openOrders = prev.filter((o) => o.status === 'open')
      if (openOrders.length === 0) return prev

      setSpotBalances((balances) =>
        openOrders.reduce((acc, order) => unfreezeLimitOrder(acc, order), balances),
      )

      const openIds = new Set(openOrders.map((o) => o.id))
      return prev.map((o) =>
        openIds.has(o.id) ? { ...o, status: 'cancelled' as const } : o,
      )
    })
  }, [])

  const isFavorite = useCallback(
    (pairId: string) => favoritePairIds.includes(pairId),
    [favoritePairIds],
  )

  const toggleFavorite = useCallback((pairId: string) => {
    setFavoritePairIds((prev) =>
      prev.includes(pairId)
        ? prev.filter((id) => id !== pairId)
        : [...prev, pairId],
    )
  }, [])

  const addFavorite = useCallback((pairId: string) => {
    setFavoritePairIds((prev) =>
      prev.includes(pairId) ? prev : [...prev, pairId],
    )
  }, [])

  const quickAddFavorite = useCallback(() => {
    const next = marketPairs.find((p) => !favoritePairIds.includes(p.id))
    if (!next) {
      showToast('已全部加入自选', 'info')
      return
    }
    addFavorite(next.id)
    showToast('添加成功')
  }, [addFavorite, favoritePairIds, showToast])

  const openComplianceRestriction = useCallback(
    (options?: ComplianceRestrictionOptions) => {
      setComplianceModule(options?.module ?? null)
      setShowComplianceRestriction(true)
    },
    [],
  )

  const closeComplianceRestriction = useCallback(() => {
    setShowComplianceRestriction(false)
    setComplianceModule(null)
  }, [])

  const openVersionUpdate = useCallback(
    (variant: VersionUpdateVariant, info?: Partial<VersionUpdateInfo>) => {
      setVersionUpdateVariant(variant)
      if (info) {
        setVersionUpdateInfo((prev) => ({ ...prev, ...info }))
      } else {
        setVersionUpdateInfo({ ...defaultVersionUpdateInfo })
      }
    },
    [],
  )

  const closeVersionUpdate = useCallback(() => {
    setVersionUpdateVariant(null)
  }, [])

  const openWallet = useCallback(
    (
      flow: 'deposit' | 'withdraw' | 'transfer',
      options?: { coin?: WalletCoin },
    ) => {
      if (flow === 'transfer') {
        setWalletScreen({ screen: 'transfer', coin: options?.coin })
        return
      }

      if (flow === 'withdraw') {
        setWalletScreen({ screen: 'withdraw', coin: options?.coin })
        return
      }

      const coin = options?.coin ?? 'USDT'
      const networks = getDepositNetworksForCoin(coin)
      const chain = networks[0]?.id ?? 'TRC20'

      setWalletScreen(
        activatedDepositKeys.includes(depositKey(coin, chain))
          ? { screen: 'deposit-address', coin, chain }
          : { screen: 'deposit', coin, chain },
      )
    },
    [activatedDepositKeys],
  )

  const closeWallet = useCallback(() => {
    setWalletScreen(null)
    setWithdrawDraft(null)
  }, [])

  const navigateWallet = useCallback((screen: WalletScreenState) => {
    setWalletScreen(screen)
  }, [])

  const isDepositActivated = useCallback(
    (coin: WalletCoin, chain: WalletNetwork) =>
      activatedDepositKeys.includes(depositKey(coin, chain)),
    [activatedDepositKeys],
  )

  const activateDeposit = useCallback((coin: WalletCoin, chain: WalletNetwork) => {
    const key = depositKey(coin, chain)
    setActivatedDepositKeys((prev) =>
      prev.includes(key) ? prev : [...prev, key],
    )
  }, [])

  const openHelpCenter = useCallback(() => {
    setSupportScreen({ screen: 'help' })
  }, [])

  const openSupportCenter = useCallback(() => {
    setSupportScreen({ screen: 'support' })
  }, [])

  const closeSupport = useCallback(() => {
    setSupportScreen(null)
  }, [])

  const navigateSupport = useCallback((screen: SupportScreenState) => {
    setSupportScreen(screen)
  }, [])

  const openFundHistory = useCallback(() => {
    setRecordsScreen({ screen: 'fund' })
  }, [])

  const openOrderHistory = useCallback(() => {
    setRecordsScreen({ screen: 'orders' })
  }, [])

  const closeRecords = useCallback(() => {
    setRecordsScreen(null)
  }, [])

  const navigateRecords = useCallback((screen: RecordsScreenState) => {
    setRecordsScreen(screen)
  }, [])

  const addFundRecord = useCallback((record: FundRecord) => {
    setFundRecords((prev) => [record, ...prev])
  }, [])

  const setPreviewPlatform = useCallback((platform: PreviewPlatform) => {
    setPreviewPlatformState(platform)
    if (platform === 'pc') {
      setActiveTab('home')
    } else {
      setActiveTab((tab) => (tab === 'home' ? 'market' : tab))
    }
  }, [])

  const setAppTheme = useCallback((theme: AppTheme) => {
    setAppThemeState(theme)
    saveAppTheme(theme)
  }, [])

  const openKline = useCallback(
    (pairId?: string) => {
      setChartScreen({ pairId: pairId ?? selectedPairId })
    },
    [selectedPairId],
  )

  const closeKline = useCallback(() => {
    setChartScreen(null)
  }, [])

  const value = useMemo(
    () => ({
      isLoggedIn,
      setLoggedIn: (v: boolean) => {
        setLoggedIn(v)
        if (!v) {
          setAuthScreen(null)
          setAccountScreen(null)
          setWalletScreen(null)
          setWithdrawDraft(null)
          setSupportScreen(null)
          setRecordsScreen(null)
          setChartScreen(null)
          resetTradeState()
        }
      },
      activeTab,
      setActiveTab,
      productModule,
      setProductModule,
      user,
      updateProfile,
      locale,
      setLocale,
      fiat,
      setFiat,
      activeSheet,
      openSheet,
      closeSheet,
      authScreen,
      openLogin,
      openRegister,
      openAuth,
      closeAuth,
      setAuthScreen,
      completeAuth,
      accountScreen,
      openAccount,
      closeAccount,
      navigateAccount,
      logout,
      deleteAccount,
      selectedPairId,
      selectPair,
      openTrade,
      spotBalances,
      orders,
      pendingOrder,
      tradeSheet,
      submitOrder,
      confirmOrder,
      cancelPendingOrder,
      cancelOrder,
      cancelAllOpenOrders,
      openTradeSheet,
      closeTradeSheet,
      favoritePairIds,
      toggleFavorite,
      isFavorite,
      addFavorite,
      quickAddFavorite,
      showComplianceRestriction,
      complianceModule,
      openComplianceRestriction,
      closeComplianceRestriction,
      versionUpdateVariant,
      versionUpdateInfo,
      openVersionUpdate,
      closeVersionUpdate,
      walletScreen,
      withdrawDraft,
      antiPhishingDraft,
      antiPhishingOverlay,
      clearAntiPhishingOverlay,
      openAntiPhishingDemo,
      openWallet,
      closeWallet,
      navigateWallet,
      setWithdrawDraft,
      setAntiPhishingDraft,
      activatedDepositKeys,
      isDepositActivated,
      activateDeposit,
      supportScreen,
      openHelpCenter,
      openSupportCenter,
      closeSupport,
      navigateSupport,
      recordsScreen,
      fundRecords,
      openFundHistory,
      openOrderHistory,
      closeRecords,
      navigateRecords,
      addFundRecord,
      previewPlatform,
      setPreviewPlatform,
      appTheme,
      setAppTheme,
      chartScreen,
      openKline,
      closeKline,
      figmaToast,
      figmaExport,
      figmaPcViewport,
      figmaWalletOverlay,
      figmaAntiPhishingOverlay,
      figmaTradeOverlay,
      figmaAccountOverlay,
      toast,
      showToast,
      dismissToast,
    }),
    [
      isLoggedIn,
      activeTab,
      productModule,
      user,
      updateProfile,
      locale,
      fiat,
      activeSheet,
      authScreen,
      accountScreen,
      selectedPairId,
      spotBalances,
      orders,
      pendingOrder,
      tradeSheet,
      openLogin,
      openRegister,
      openAuth,
      closeAuth,
      completeAuth,
      openSheet,
      closeSheet,
      openAccount,
      closeAccount,
      navigateAccount,
      logout,
      deleteAccount,
      selectPair,
      openTrade,
      submitOrder,
      confirmOrder,
      cancelPendingOrder,
      cancelOrder,
      cancelAllOpenOrders,
      openTradeSheet,
      closeTradeSheet,
      favoritePairIds,
      toggleFavorite,
      isFavorite,
      addFavorite,
      quickAddFavorite,
      showComplianceRestriction,
      complianceModule,
      openComplianceRestriction,
      closeComplianceRestriction,
      versionUpdateVariant,
      versionUpdateInfo,
      openVersionUpdate,
      closeVersionUpdate,
      walletScreen,
      withdrawDraft,
      antiPhishingDraft,
      antiPhishingOverlay,
      clearAntiPhishingOverlay,
      openAntiPhishingDemo,
      openWallet,
      closeWallet,
      navigateWallet,
      setWithdrawDraft,
      setAntiPhishingDraft,
      supportScreen,
      openHelpCenter,
      openSupportCenter,
      closeSupport,
      navigateSupport,
      recordsScreen,
      fundRecords,
      openFundHistory,
      openOrderHistory,
      closeRecords,
      navigateRecords,
      addFundRecord,
      resetTradeState,
      activatedDepositKeys,
      isDepositActivated,
      activateDeposit,
      previewPlatform,
      chartScreen,
      openKline,
      closeKline,
      setPreviewPlatform,
      appTheme,
      setAppTheme,
      figmaToast,
      figmaExport,
      figmaPcViewport,
      figmaWalletOverlay,
      figmaAntiPhishingOverlay,
      figmaTradeOverlay,
      figmaAccountOverlay,
      toast,
      showToast,
      dismissToast,
    ],
  )

  return (
    <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>
  )
}

export function usePrototype() {
  const ctx = useContext(PrototypeContext)
  if (!ctx) throw new Error('usePrototype must be used within PrototypeProvider')
  return ctx
}
