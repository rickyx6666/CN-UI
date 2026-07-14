import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePrototype } from '../context/PrototypeContext'
import { portfolioSummary } from '../data/mock'
import { formatUsd } from '../data/mock'
import {
  approximateCny,
  assetAccountLabels,
  assetAccountPnl,
  assetAccountSummaries,
  getAccountBalanceUsd,
  type AssetAccountId,
} from '../data/assets'
import { AppLayout } from '../components/AppLayout'
import { BalanceHero } from '../components/BalanceHero'
import { AccountBalanceSummary } from '../components/assets/AccountBalanceSummary'
import { FundingAssetsPanel } from '../components/assets/FundingAssetsPanel'
import { SpotAssetsPanel } from '../components/assets/SpotAssetsPanel'
import { ContractAssetsPanel } from '../components/contract/ContractAssetsPanel'
import type { AccountBalanceAction } from '../components/assets/AccountBalanceSummary'
import type { BottomTabId } from '../data/mock'
import type { ProductModule } from '../data/productModule'
import type { WalletCoin } from '../data/wallet'

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
  const [activeAccount, setActiveAccount] = useState<AssetAccountId | null>(
    null,
  )

  useEffect(() => {
    if (!user.isLoggedIn && !autoOpened.current) {
      autoOpened.current = true
      openAuth()
    }
  }, [user.isLoggedIn, openAuth])

  if (!user.isLoggedIn) {
    return null
  }

  if (activeAccount) {
    return (
      <AccountDetailView
        accountId={activeAccount}
        onBack={() => setActiveAccount(null)}
        openWallet={openWallet}
        openFundHistory={openFundHistory}
        openOrderHistory={openOrderHistory}
        openContractHistory={openContractHistory}
        setActiveTab={setActiveTab}
        setProductModule={setProductModule}
      />
    )
  }

  return (
    <AppLayout>
      <BalanceHero portfolio={portfolioSummary} user={user} />

      <div className="layout-screen-x space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openWallet('deposit')}
            className="h-11 min-w-0 flex-1 rounded-md bg-brand text-body-sm font-semibold text-brand-dark active:bg-brand-hover"
          >
            充币
          </button>
          <button
            type="button"
            onClick={() => openWallet('withdraw')}
            className="h-11 min-w-0 flex-1 rounded-md border border-border text-body-sm font-medium text-primary active:bg-elevated"
          >
            提币
          </button>
          <button
            type="button"
            onClick={() => openWallet('transfer')}
            className="h-11 min-w-0 flex-1 rounded-md border border-border text-body-sm font-medium text-primary active:bg-elevated"
          >
            划转
          </button>
        </div>

        <div className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-elevated">
          <RecordLink
            label="邀请好友"
            onClick={() => navigateAccount({ screen: 'invite' })}
          />
          <RecordLink label="充提记录" onClick={openFundHistory} />
          <RecordLink label="订单明细" onClick={openOrderHistory} />
        </div>
      </div>

      <section className="layout-screen-x mt-5 pb-4">
        <h2 className="mb-3 text-body-sm font-medium text-secondary">账户</h2>
        <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-elevated">
          {assetAccountSummaries.map((account) => (
            <li key={account.id}>
              <button
                type="button"
                onClick={() => setActiveAccount(account.id)}
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
    </AppLayout>
  )
}

function AccountDetailView({
  accountId,
  onBack,
  openWallet,
  openFundHistory,
  openOrderHistory,
  openContractHistory,
  setActiveTab,
  setProductModule,
}: {
  accountId: AssetAccountId
  onBack: () => void
  openWallet: (
    flow: 'deposit' | 'withdraw' | 'transfer',
    options?: { coin?: WalletCoin },
  ) => void
  openFundHistory: () => void
  openOrderHistory: () => void
  openContractHistory: () => void
  setActiveTab: (tab: BottomTabId) => void
  setProductModule: (module: ProductModule) => void
}) {
  const balanceLabel = accountId === 'contract' ? '保证金余额' : '预估总资产'
  const pnl = assetAccountPnl[accountId]

  const actions: AccountBalanceAction[] =
    accountId === 'contract'
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
    if (accountId === 'funding') {
      openFundHistory()
      return
    }
    if (accountId === 'spot') {
      openOrderHistory()
      return
    }
    openContractHistory()
  }

  return (
    <AppLayout>
      <AccountDetailHeader
        title={assetAccountLabels[accountId]}
        onBack={onBack}
      />
      <section className="layout-screen-x pb-4">
        <AccountBalanceSummary
          label={balanceLabel}
          balanceUsd={getAccountBalanceUsd(accountId)}
          pnlUsd={pnl.usd}
          pnlPercent={pnl.percent}
          actions={actions}
          onHistoryClick={handleHistoryClick}
        />
        {accountId === 'funding' && <FundingAssetsPanel />}
        {accountId === 'spot' && <SpotAssetsPanel />}
        {accountId === 'contract' && <ContractAssetsPanel />}
      </section>
    </AppLayout>
  )
}

function AccountDetailHeader({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <header className="layout-screen-x flex items-center gap-1 pb-4 pt-3">
      <button
        type="button"
        aria-label="返回"
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center text-primary active:opacity-70"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>
      <h1 className="text-h3 font-medium text-primary">{title}</h1>
    </header>
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
