import { useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { usePrototype } from '../context/PrototypeContext'
import { coinBalances, portfolioSummary } from '../data/mock'
import { formatBalance, formatUsd } from '../data/mock'
import type { WalletCoin } from '../data/wallet'
import { AppLayout } from '../components/AppLayout'
import { BalanceHero } from '../components/BalanceHero'
import { CoinAvatar } from '../components/CoinAvatar'
import { ProductModuleTabs } from '../components/ProductModuleTabs'
import { ContractAssetsPanel } from '../components/contract/ContractAssetsPanel'

const coinToWallet: Record<string, WalletCoin> = {
  USDT: 'USDT',
  BNB: 'BNB',
  TRX: 'TRX',
}

export function AssetsPage() {
  const {
    user,
    openAuth,
    openWallet,
    openFundHistory,
    openOrderHistory,
    navigateAccount,
    productModule,
    setProductModule,
  } =
    usePrototype()
  const autoOpened = useRef(false)

  useEffect(() => {
    if (!user.isLoggedIn && !autoOpened.current) {
      autoOpened.current = true
      openAuth()
    }
  }, [user.isLoggedIn, openAuth])

  if (!user.isLoggedIn) {
    return null
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
        <div className="mb-3">
          <ProductModuleTabs
            active={productModule}
            onChange={setProductModule}
          />
        </div>

        {productModule === 'contract' ? (
          <ContractAssetsPanel />
        ) : (
          <>
            <h2 className="mb-3 text-body-sm font-medium text-secondary">我的资产</h2>
            <ul className="divide-y divide-border-subtle">
              {coinBalances.map((coin) => {
                const walletCoin = coinToWallet[coin.symbol]

                return (
                  <li
                    key={coin.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <CoinAvatar symbol={coin.symbol} size={32} />
                      <div>
                        <p className="text-body font-medium text-primary">
                          {coin.symbol}
                        </p>
                        <p className="text-caption text-secondary">{coin.chain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="tabular-nums text-body text-primary">
                        {formatBalance(coin.balance, coin.symbol)}
                      </p>
                      <p className="tabular-nums text-caption text-secondary">
                        ${formatUsd(coin.usdValue)}
                      </p>
                      {walletCoin && (
                        <div className="mt-1.5 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openWallet('deposit', { coin: walletCoin })}
                            className="text-[10px] text-brand"
                          >
                            充币
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openWallet('withdraw', { coin: walletCoin })
                            }
                            className="text-[10px] text-secondary"
                          >
                            提币
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>
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
