import { useMemo, useState } from 'react'
import { usePrototype } from '../context/PrototypeContext'
import {
  contractPairs,
} from '../data/contract'
import { marketPairs } from '../data/mock'
import { generateOrderBook, spotOrderBookLevels, contractOrderBookLevels } from '../data/trade'
import { AppLayout } from '../components/AppLayout'
import { Annotatable } from '../components/inspect/Annotatable'
import { ProductModuleTabs } from '../components/ProductModuleTabs'
import { ContractBottomPanel } from '../components/contract/ContractBottomPanel'
import { ContractFundingRate } from '../components/contract/ContractFundingRate'
import { ContractPairBar } from '../components/contract/ContractPairBar'
import { ContractTradePanel } from '../components/contract/ContractTradePanel'
import { OrderBook } from '../components/trade/OrderBook'
import { OrderForm } from '../components/trade/OrderForm'
import { TradeMarketColumns } from '../components/trade/TradeMarketColumns'
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
    () =>
      generateOrderBook(
        pair.price,
        contractMode ? contractOrderBookLevels : spotOrderBookLevels,
      ),
    [pair.price, contractMode],
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
          <ContractPairBar
            pair={pair}
            onSelectPair={() => openTradeSheet('pair-picker')}
            onOpenKline={() => openKline(pair.id)}
          />
          <TradeMarketColumns
            form={
              <Annotatable id="contract-trade-panel" className="w-full">
                <ContractTradePanel
                  pair={pair}
                  isLoggedIn={user.isLoggedIn}
                  onLogin={openAuth}
                />
              </Annotatable>
            }
            book={
              <>
                <ContractFundingRate pair={pair} />
                <OrderBook
                  pair={pair}
                  asks={asks}
                  bids={bids}
                  showDepthRatio
                  compact
                  onPriceSelect={setSelectedPrice}
                />
              </>
            }
          />
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

          <TradeMarketColumns
            form={
              <Annotatable id="trade-order-form" className="w-full">
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
            }
            book={
              <OrderBook
                pair={pair}
                asks={asks}
                bids={bids}
                onPriceSelect={setSelectedPrice}
              />
            }
          />

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
