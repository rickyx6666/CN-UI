import { useMemo, useState } from 'react'
import { usePrototype } from '../context/PrototypeContext'
import { contractPairs } from '../data/contract'
import {
  marketPairs,
  marketTabs,
  portfolioSummary,
  marketQuickActions,
  type MarketTab,
  type MarketPair,
} from '../data/mock'
import { AppLayout } from '../components/AppLayout'
import { Annotatable } from '../components/inspect/Annotatable'
import { BalanceHero } from '../components/BalanceHero'
import { GuestWelcome } from '../components/GuestWelcome'
import { GuideBanner } from '../components/GuideBanner'
import { MarketList } from '../components/MarketList'
import { MarketTabs } from '../components/MarketTabs'
import { ProductModuleTabs } from '../components/ProductModuleTabs'
import { QuickActions } from '../components/QuickActions'
import { FavoritesGrid } from '../components/market/FavoritesGrid'
import { MarketListHeader } from '../components/market/MarketListHeader'
import { MarketSearchBar } from '../components/market/MarketSearchBar'

function filterMarketPairs(
  pairs: MarketPair[],
  marketTab: MarketTab,
  favoritePairIds: string[],
  query: string,
  contractMode: boolean,
) {
  const q = query.trim().toLowerCase()
  const base =
    marketTab === 'favorites'
      ? pairs.filter((pair) =>
          contractMode
            ? favoritePairIds.includes(pair.id.replace('perp-', ''))
            : favoritePairIds.includes(pair.id),
        )
      : pairs

  if (!q) return base
  return base.filter(
    (pair) =>
      pair.symbol.toLowerCase().includes(q) ||
      pair.base.toLowerCase().includes(q) ||
      `${pair.base}/${pair.quote}`.toLowerCase().includes(q),
  )
}

export function MarketPage() {
  const {
    user,
    openAuth,
    favoritePairIds,
    quickAddFavorite,
    productModule,
    setProductModule,
  } = usePrototype()
  const { isLoggedIn } = user
  const [marketTab, setMarketTab] = useState<MarketTab>('market')
  const [query, setQuery] = useState('')

  const contractMode = productModule === 'contract'
  const sourcePairs = contractMode ? contractPairs : marketPairs

  const filteredPairs = useMemo(
    () =>
      filterMarketPairs(
        sourcePairs,
        marketTab,
        favoritePairIds,
        query,
        contractMode,
      ),
    [sourcePairs, marketTab, favoritePairIds, query, contractMode],
  )

  return (
    <AppLayout>
      {isLoggedIn ? (
        <BalanceHero portfolio={portfolioSummary} user={user} />
      ) : (
        <>
          <GuestWelcome />
          <div className="pb-2">
            <GuideBanner />
          </div>
        </>
      )}

      {isLoggedIn && (
        <div className="layout-section-divider">
          <QuickActions actions={marketQuickActions} />
        </div>
      )}

      <div className="layout-screen-x layout-content-top layout-stack layout-section-divider pb-3">
        <Annotatable id="market-search">
          <MarketSearchBar value={query} onChange={setQuery} />
        </Annotatable>
        <MarketTabs tabs={marketTabs} active={marketTab} onChange={setMarketTab} />
      </div>

      <div className="layout-screen-x layout-section-divider">
        <ProductModuleTabs
          active={productModule}
          onChange={setProductModule}
        />
      </div>

      {marketTab === 'favorites' ? (
        <>
          <FavoritesGrid pairs={filteredPairs} contractMode={contractMode} />
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={quickAddFavorite}
              className="h-10 w-full rounded-md bg-brand text-body-sm font-semibold text-brand-dark active:bg-brand-hover"
            >
              添加自选
            </button>
          </div>
          {!isLoggedIn && (
            <div className="mx-3 mb-3 flex items-center justify-between rounded-lg bg-elevated px-3 py-2.5">
              <span className="text-caption text-secondary">登录后同步自选</span>
              <button
                type="button"
                onClick={openAuth}
                className="rounded-md bg-sunken px-3 py-1 text-caption font-medium text-primary"
              >
                登录
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <MarketListHeader contractMode={contractMode} />
          <MarketList pairs={filteredPairs} contractMode={contractMode} />
        </>
      )}
    </AppLayout>
  )
}
