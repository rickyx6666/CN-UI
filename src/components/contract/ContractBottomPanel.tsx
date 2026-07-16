import { useMemo, useState } from 'react'
import { ChevronUp, CircleHelp, ClipboardList, FileText } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import {
  contractOpenOrders,
  contractPairLabel,
  contractPositions,
  type ContractOpenOrder,
  type ContractOrderCategory,
} from '../../data/contract'
import { usePrototype } from '../../context/PrototypeContext'
import { useContractOrderEdit } from './ContractOrderEditContext'
import { ContractOpenOrderCard } from './ContractOpenOrderCard'
import { ContractPositionCard } from './ContractPositionCard'
import { ContractTpSlOrderCard } from './ContractTpSlOrderCard'

type ContractPanelTab = 'positions' | 'orders'

interface ContractBottomPanelProps {
  pair: MarketPair
  isLoggedIn: boolean
  onOpenKline?: () => void
}

export function ContractBottomPanel({
  pair,
  isLoggedIn,
  onOpenKline,
}: ContractBottomPanelProps) {
  const { openContractHistory } = usePrototype()
  const { openContractOrderEdit } = useContractOrderEdit()
  const [tab, setTab] = useState<ContractPanelTab>('positions')
  const [subTab, setSubTab] = useState<ContractOrderCategory>('basic')
  const [hideOtherContracts, setHideOtherContracts] = useState(false)
  const [orders, setOrders] = useState<ContractOpenOrder[]>(contractOpenOrders)

  const visiblePositions = useMemo(() => {
    if (!isLoggedIn) return []
    const positions = hideOtherContracts
      ? contractPositions.filter((p) => p.symbol === pair.base)
      : contractPositions
    return positions
  }, [hideOtherContracts, isLoggedIn, pair.base])

  const basicCount = orders.filter((order) => order.category === 'basic').length
  const conditionalCount = orders.filter(
    (order) => order.category === 'conditional',
  ).length

  const visibleOrders = useMemo(() => {
    if (!isLoggedIn) return []
    return orders.filter((order) => {
      if (order.category !== subTab) return false
      if (hideOtherContracts && order.symbol !== pair.base) return false
      return true
    })
  }, [hideOtherContracts, isLoggedIn, orders, pair.base, subTab])

  const positionCount = isLoggedIn ? contractPositions.length : 0

  const tabs: { id: ContractPanelTab; label: string }[] = [
    { id: 'positions', label: `持有仓位 (${positionCount})` },
    { id: 'orders', label: `当前委托 (${orders.length})` },
  ]

  function cancelOrder(orderId: string) {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  function cancelAll() {
    setOrders((prev) =>
      prev.filter((order) => {
        if (order.category !== subTab) return true
        if (hideOtherContracts && order.symbol !== pair.base) return true
        return false
      }),
    )
  }

  function confirmBasicEdit(
    orderId: string,
    values: { price: number; size: number },
  ) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.category === 'basic'
          ? { ...order, price: values.price, size: values.size }
          : order,
      ),
    )
  }

  function confirmConditionalEdit(
    orderId: string,
    values: { triggerPrice: number },
  ) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.category === 'conditional'
          ? { ...order, triggerPrice: values.triggerPrice }
          : order,
      ),
    )
  }

  return (
    <section className="mt-1 border-t border-border-subtle">
      <div className="flex items-center justify-between border-b border-border-subtle px-3">
        <div className="flex gap-3 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative shrink-0 py-2.5 text-caption font-medium ${
                tab === item.id ? 'text-primary' : 'text-secondary'
              }`}
            >
              {item.label}
              {tab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="合约账单"
          onClick={openContractHistory}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-secondary active:opacity-70"
        >
          <FileText className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {tab === 'positions' && isLoggedIn && (
        <ToolbarRow
          hideOtherContracts={hideOtherContracts}
          onHideOtherContractsChange={setHideOtherContracts}
          actionLabel="一键平仓"
        />
      )}

      {tab === 'orders' && isLoggedIn && (
        <>
          <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
            <div className="flex items-center gap-2">
              <SubTabChip
                label={`基础单 (${basicCount})`}
                active={subTab === 'basic'}
                onClick={() => setSubTab('basic')}
              />
              <SubTabChip
                label={`条件委托 (${conditionalCount})`}
                active={subTab === 'conditional'}
                onClick={() => setSubTab('conditional')}
              />
            </div>
            <button
              type="button"
              aria-label="说明"
              className="flex h-7 w-7 shrink-0 items-center justify-center text-secondary active:opacity-70"
            >
              <CircleHelp className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <ToolbarRow
            hideOtherContracts={hideOtherContracts}
            onHideOtherContractsChange={setHideOtherContracts}
            actionLabel="全部取消"
            onAction={visibleOrders.length > 0 ? cancelAll : undefined}
          />
        </>
      )}

      <div className="min-h-[72px] px-3">
        {!isLoggedIn ? (
          <ContractPanelEmptyState
            message={tab === 'positions' ? '暂无仓位' : '暂无委托'}
            icon={tab === 'positions' ? 'positions' : 'orders'}
          />
        ) : tab === 'positions' ? (
          visiblePositions.length === 0 ? (
            <ContractPanelEmptyState message="暂无仓位" icon="positions" />
          ) : (
            <div>
              {visiblePositions.map((position) => (
                <ContractPositionCard key={position.id} position={position} />
              ))}
            </div>
          )
        ) : visibleOrders.length === 0 ? (
          <ContractPanelEmptyState message="暂无委托" icon="orders" />
        ) : (
          <div>
            {visibleOrders.map((order) =>
              order.category === 'conditional' ? (
                <ContractTpSlOrderCard
                  key={order.id}
                  order={order}
                  onCancel={() => cancelOrder(order.id)}
                  onEdit={() =>
                    openContractOrderEdit(
                      { kind: 'conditional', order },
                      {
                        onConfirmBasic: confirmBasicEdit,
                        onConfirmConditional: confirmConditionalEdit,
                      },
                    )
                  }
                />
              ) : (
                <ContractOpenOrderCard
                  key={order.id}
                  order={order}
                  onCancel={() => cancelOrder(order.id)}
                  onEdit={() =>
                    openContractOrderEdit(
                      { kind: 'basic', order },
                      {
                        onConfirmBasic: confirmBasicEdit,
                        onConfirmConditional: confirmConditionalEdit,
                      },
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenKline}
        className="flex w-full items-center justify-center gap-1 border-t border-border-subtle py-2.5 text-caption text-secondary active:bg-sunken"
      >
        <span>{contractPairLabel(pair)} 图表</span>
        <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </section>
  )
}

function ToolbarRow({
  hideOtherContracts,
  onHideOtherContractsChange,
  actionLabel,
  onAction,
}: {
  hideOtherContracts: boolean
  onHideOtherContractsChange: (checked: boolean) => void
  actionLabel: string
  onAction?: () => void
}) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
      <label className="flex items-center gap-2 text-[10px] text-secondary">
        <input
          type="checkbox"
          checked={hideOtherContracts}
          onChange={(e) => onHideOtherContractsChange(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-border accent-brand"
        />
        隐藏其他合约
      </label>
      <button
        type="button"
        onClick={onAction}
        disabled={!onAction}
        className="text-[10px] font-medium text-primary active:opacity-70 disabled:opacity-40"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function SubTabChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
        active
          ? 'bg-sunken text-primary'
          : 'text-secondary active:opacity-70'
      }`}
    >
      {label}
    </button>
  )
}

function ContractPanelEmptyState({
  message,
  icon,
}: {
  message: string
  icon: 'positions' | 'orders'
}) {
  const Icon = icon === 'positions' ? ClipboardList : FileText

  return (
    <div className="flex flex-col items-center py-10 text-secondary">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <Icon className="h-10 w-10 opacity-35" strokeWidth={1.25} />
      </div>
      <p className="mt-1 text-caption">{message}</p>
    </div>
  )
}
