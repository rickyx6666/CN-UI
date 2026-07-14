import { useMemo, useState } from 'react'
import { usePrototype } from '../context/PrototypeContext'
import {
  contractPairs,
  type ContractMarketType,
} from '../data/contract'
import { marketPairs } from '../data/mock'
import { generateOrderBook } from '../data/trade'
import { AppLayout } from '../components/AppLayout'
import { Annotatable } from '../components/inspect/Annotatable'
import { ProductModuleTabs } from '../components/ProductModuleTabs'
import { ContractBottomPanel } from '../components/contract/ContractBottomPanel'
import { ContractPairBar } from '../components/contract/ContractPairBar'
import { ContractSubTabs } from '../components/contract/ContractSubTabs'
import { ContractTradePanel } from '../components/contract/ContractTradePanel'
import { OrderBook } from '../components/trade/OrderBook'
import { OrderForm } from '../components/trade/OrderForm'
import { TradeBottomPanel } from '../components/trade/TradeBottomPanel'
import { TradePairBar } from '../components/trade/TradePairBar'

export function TradePage() {
  const {
    user,
    openAuth,
    selectedPairId,
    spotBalances,
    orders,
    submitOrder,
    cancelOrder,
    cancelAllOpenOrders,
    openTradeSheet,
    openOrderHistory,
    openKline,
    productModule,
    setProductModule,
  } = usePrototype()

  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [contractMarketType, setContractMarketType] =
    useState<ContractMarketType>('usdt')
  const contractMode = productModule === 'contract'

  const pair = useMemo(() => {
    if (contractMode) {
      return (
        contractPairs.find((item) => item.id === selectedPairId) ??
        contractPairs.find((item) => item.id === `perp-${selectedPairId}`) ??
        contractPairs[0]
      )
    }
    return marketPairs.find((item) => item.id === selectedPairId) ?? marketPairs[0]
  }, [contractMode, selectedPairId])

  const { asks, bids } = useMemo(
    () => generateOrderBook(pair.price),
    [pair.price],
  )

  return (
    <AppLayout>
      <div className="border-b border-border-subtle px-3 pt-1">
        <ProductModuleTabs
          active={productModule}
          onChange={setProductModule}
        />
      </div>

      {contractMode ? (
        <>
          <ContractSubTabs
            active={contractMarketType}
            onChange={setContractMarketType}
          />
          <ContractPairBar
            pair={pair}
            onSelectPair={() => openTradeSheet('pair-picker')}
            onOpenKline={() => openKline(pair.id)}
          />
          <div className="flex items-start gap-1.5 px-3 pb-2">
            <OrderBook
              pair={pair}
              asks={asks}
              bids={bids}
              showDepthRatio
              onPriceSelect={setSelectedPrice}
            />
            <Annotatable id="contract-trade-panel">
              <ContractTradePanel
                pair={pair}
                isLoggedIn={user.isLoggedIn}
                onLogin={openAuth}
              />
            </Annotatable>
          </div>
          <ContractBottomPanel
            pair={pair}
            isLoggedIn={user.isLoggedIn}
            onOpenKline={() => openKline(pair.id)}
          />
        </>
      ) : (
        <>
          <TradePairBar
            pair={pair}
            onSelectPair={() => openTradeSheet('pair-picker')}
            onOpenKline={() => openKline(pair.id)}
          />

          <div className="flex items-start gap-2 px-3 pb-2">
            <Annotatable id="trade-order-form">
              <OrderForm
                pair={pair}
                balances={spotBalances}
                isLoggedIn={user.isLoggedIn}
                onLogin={openAuth}
                selectedPrice={selectedPrice}
                onSubmit={({ side, type, price, amount, total, fee }) =>
                  submitOrder({
                    pairId: pair.id,
                    base: pair.base,
                    quote: pair.quote,
                    side,
                    type,
                    price,
                    amount,
                    total,
                    fee,
                  })
                }
              />
            </Annotatable>
            <OrderBook
              pair={pair}
              asks={asks}
              bids={bids}
              onPriceSelect={setSelectedPrice}
            />
          </div>

          <TradeBottomPanel
            orders={orders}
            balances={spotBalances}
            pairBase={pair.base}
            pairQuote={pair.quote}
            pairId={pair.id}
            onCancel={cancelOrder}
            onCancelAll={cancelAllOpenOrders}
            onOpenOrderHistory={openOrderHistory}
            isLoggedIn={user.isLoggedIn}
          />
        </>
      )}
    </AppLayout>
  )
}
