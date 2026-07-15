import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePrototype } from '../context/PrototypeContext'
import { formatUsd, getKycLabel, portfolioSummary } from '../data/mock'
import {
  approximateCny,
  assetAccountSummaries,
  assetAccountPnl,
  getAccountBalanceUsd,
  type AssetAccountId,
  type AssetPageTabId,
} from '../data/assets'
import { AppLayout } from '../components/AppLayout'
import { AccountBalanceSummary } from '../components/assets/AccountBalanceSummary'
import type { AccountBalanceAction } from '../components/assets/AccountBalanceSummary'
import { AssetAccountTabs } from '../components/assets/AssetAccountTabs'
import { FundingAssetsPanel } from '../components/assets/FundingAssetsPanel'
import { SpotAssetsPanel } from '../components/assets/SpotAssetsPanel'
import { ContractAssetsPanel } from '../components/contract/ContractAssetsPanel'
import { ContractMarginBalanceInfoSheet } from '../components/contract/ContractMarginBalanceInfoSheet'
import { AssetHistoryPickerSheet } from '../components/assets/AssetHistoryPickerSheet'
import type { AssetCoinAccountType } from '../data/assetCoinDetail'
import { FundingCoinDetailPage } from './assets/FundingCoinDetailPage'
import { SpotCoinDetailPage } from './assets/SpotCoinDetailPage'

interface AssetCoinDetailState {
  accountType: AssetCoinAccountType
  symbol: string
}

export function AssetsPage() {
  const {
    user,
    openAuth,
    openWallet,
    openFundHistory,
    openOrderHistory,
    openContractHistory,
    navigateAccount,
    setActiveTab,
    setProductModule,
  } = usePrototype()
  const autoOpened = useRef(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActivePageTab] = useState<AssetPageTabId>('overview')
  const [coinDetail, setCoinDetail] = useState<AssetCoinDetailState | null>(null)
  const [historyPickerOpen, setHistoryPickerOpen] = useState(false)
  const [marginBalanceInfoOpen, setMarginBalanceInfoOpen] = useState(false)

  useEffect(() => {
    if (!user.isLoggedIn && !autoOpened.current) {
      autoOpened.current = true
      openAuth()
    }
  }, [user.isLoggedIn, openAuth])

  function scrollToTabs() {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function selectTab(tabId: AssetPageTabId) {
    setActivePageTab(tabId)
    scrollToTabs()
  }

  function selectAccountFromOverview(accountId: AssetAccountId) {
    setActivePageTab(accountId)
    scrollToTabs()
  }

  function openCoinDetail(accountType: AssetCoinAccountType, symbol: string) {
    setCoinDetail({ accountType, symbol })
  }

  if (!user.isLoggedIn) {
    return null
  }

  if (coinDetail) {
    if (coinDetail.accountType === 'funding') {
      return (
        <FundingCoinDetailPage
          symbol={coinDetail.symbol}
          onBack={() => setCoinDetail(null)}
        />
      )
    }

    return (
      <SpotCoinDetailPage
        symbol={coinDetail.symbol}
        onBack={() => setCoinDetail(null)}
      />
    )
  }

  const isOverview = activeTab === 'overview'

  const balanceLabel = isOverview
    ? '预估总资产'
    : activeTab === 'contract'
      ? '保证金余额'
      : '预估总资产'

  const balanceUsd = isOverview
    ? portfolioSummary.totalUsd
    : getAccountBalanceUsd(activeTab)

  const pnl = isOverview
    ? {
        usd: portfolioSummary.pnl24hUsd,
        percent: portfolioSummary.pnl24hPercent,
      }
    : assetAccountPnl[activeTab]

  const overviewActions: AccountBalanceAction[] = [
    {
      label: '充值',
      variant: 'primary',
      onClick: () => openWallet('deposit'),
    },
    {
      label: '提现',
      variant: 'secondary',
      onClick: () => openWallet('withdraw'),
    },
    {
      label: '划转',
      variant: 'secondary',
      onClick: () => openWallet('transfer'),
    },
  ]

  const accountActions: AccountBalanceAction[] =
    activeTab === 'contract'
      ? [
          {
            label: '交易',
            variant: 'primary',
            onClick: () => {
              setProductModule('contract')
              setActiveTab('trade')
            },
          },
          {
            label: '划转',
            variant: 'secondary',
            onClick: () => openWallet('transfer'),
          },
        ]
      : [
          {
            label: '充值',
            variant: 'primary',
            onClick: () => openWallet('deposit'),
          },
          {
            label: '提现',
            variant: 'secondary',
            onClick: () => openWallet('withdraw'),
          },
          {
            label: '划转',
            variant: 'secondary',
            onClick: () => openWallet('transfer'),
          },
        ]

  const handleHistoryClick = () => {
    if (activeTab === 'overview') {
      setHistoryPickerOpen(true)
      return
    }
    if (activeTab === 'funding') {
      openFundHistory()
      return
    }
    if (activeTab === 'spot') {
      openOrderHistory()
      return
    }
    openContractHistory()
  }

  const showHistoryIcon =
    activeTab === 'overview' ||
    activeTab === 'funding' ||
    activeTab === 'spot' ||
    activeTab === 'contract'

  return (
    <AppLayout>
      <div ref={tabsRef}>
        <AssetAccountTabs active={activeTab} onChange={selectTab} />
      </div>

      <section className="layout-screen-x pt-4">
        <AccountBalanceSummary
          label={balanceLabel}
          balanceUsd={balanceUsd}
          pnlUsd={pnl.usd}
          pnlPercent={pnl.percent}
          actions={isOverview ? overviewActions : accountActions}
          onHistoryClick={showHistoryIcon ? handleHistoryClick : undefined}
          onLabelClick={
            activeTab === 'contract' ? () => setMarginBalanceInfoOpen(true) : undefined
          }
        />

        {user.kycStatus !== 'verified' && (
          <button
            type="button"
            className="mb-4 text-body-sm text-brand active:opacity-70"
            onClick={() => navigateAccount({ screen: 'kyc' })}
          >
            身份认证 · {getKycLabel(user.kycStatus)} →
          </button>
        )}

        <div className="mb-4 overflow-hidden rounded-lg border border-border-subtle bg-elevated">
          <RecordLink
            label="邀请好友"
            onClick={() => navigateAccount({ screen: 'invite' })}
          />
        </div>

        {activeTab === 'contract' && <ContractAssetsPanel />}
      </section>

      {activeTab === 'funding' ? (
        <section className="layout-screen-x pb-4">
          <FundingAssetsPanel onCoinClick={(symbol) => openCoinDetail('funding', symbol)} />
        </section>
      ) : null}

      {activeTab === 'spot' ? (
        <section className="layout-screen-x pb-4">
          <SpotAssetsPanel onCoinClick={(symbol) => openCoinDetail('spot', symbol)} />
        </section>
      ) : null}

      {isOverview ? (
        <section className="layout-screen-x pb-4">
          <h2 className="mb-3 text-body-sm font-medium text-secondary">账户</h2>
          <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-elevated">
            {assetAccountSummaries.map((account) => (
              <li key={account.id}>
                <button
                  type="button"
                  onClick={() => selectAccountFromOverview(account.id)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left active:bg-sunken"
                >
                  <span className="text-body-sm font-medium text-primary">
                    {account.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="tabular-nums text-body-sm text-primary">
                        {formatUsd(account.balanceUsd)} USDT
                      </p>
                      <p className="tabular-nums text-caption text-secondary">
                        {approximateCny(account.balanceUsd)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AssetHistoryPickerSheet
        open={historyPickerOpen}
        onClose={() => setHistoryPickerOpen(false)}
        onSelectFundHistory={openFundHistory}
        onSelectSpotHistory={openOrderHistory}
        onSelectContractHistory={openContractHistory}
      />

      <ContractMarginBalanceInfoSheet
        open={marginBalanceInfoOpen}
        onClose={() => setMarginBalanceInfoOpen(false)}
      />
    </AppLayout>
  )
}

function RecordLink({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-between px-4 text-left active:bg-sunken"
    >
      <span className="text-body-sm text-primary">{label}</span>
      <ChevronRight className="h-4 w-4 text-secondary" />
    </button>
  )
}
