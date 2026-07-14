import { useMemo, useState } from 'react'
import { ChevronDown, CircleHelp, PackageOpen } from 'lucide-react'
import { ContractOpenOrderCard } from '../../components/contract/ContractOpenOrderCard'
import { ContractTpSlOrderCard } from '../../components/contract/ContractTpSlOrderCard'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import {
  contractOpenOrderCount,
  contractOpenOrders,
  type ContractOrderCategory,
} from '../../data/contract'
import { recordsCopy } from '../../data/records'
import { usePrototype } from '../../context/PrototypeContext'

type RecordTab =
  | 'open'
  | 'history'
  | 'positions'
  | 'fills'
  | 'fund'
  | 'assets'

const mainTabs: { id: RecordTab; label: string }[] = [
  { id: 'open', label: `当前委托(${contractOpenOrderCount})` },
  { id: 'history', label: '历史委托' },
  { id: 'positions', label: '仓位历史' },
  { id: 'fills', label: '历史成交' },
  { id: 'fund', label: '资金流水' },
  { id: 'assets', label: '资产' },
]

export function ContractRecordsPage() {
  const { closeRecords } = usePrototype()
  const [tab, setTab] = useState<RecordTab>('open')
  const [subTab, setSubTab] = useState<ContractOrderCategory>('basic')
  const [orders, setOrders] = useState(contractOpenOrders)

  const basicCount = orders.filter((o) => o.category === 'basic').length
  const conditionalCount = orders.filter((o) => o.category === 'conditional').length

  const visibleOrders = useMemo(() => {
    if (tab !== 'open') return []
    return orders.filter((order) => order.category === subTab)
  }, [orders, subTab, tab])

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const cancelAll = () => {
    setOrders((prev) => prev.filter((order) => order.category !== subTab))
  }

  return (
    <div className="relative h-full min-h-0">
      <SubPageLayout title={recordsCopy.contractRecordsTitle} onBack={closeRecords}>
        <p className="-mt-3 mb-3 text-center text-[11px] text-secondary">
          {recordsCopy.contractRecordsSubtitle}
        </p>

        <div className="-mx-4 mb-3 border-b border-border-subtle px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {mainTabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative shrink-0 py-3 text-body-sm font-medium whitespace-nowrap ${
                  tab === item.id ? 'text-primary' : 'text-secondary'
                }`}
              >
                {item.label}
                {tab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand" />
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'open' && (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SubTabChip
                  label={`基础单(${basicCount})`}
                  active={subTab === 'basic'}
                  onClick={() => setSubTab('basic')}
                />
                <SubTabChip
                  label={`条件委托(${conditionalCount})`}
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

            <div className="mb-3 flex items-center gap-2">
              <FilterChip label="合约" />
              <FilterChip label="订单类型" />
              {visibleOrders.length > 0 && (
                <button
                  type="button"
                  onClick={cancelAll}
                  className="ml-auto shrink-0 text-caption text-brand"
                >
                  全部取消
                </button>
              )}
            </div>

            {visibleOrders.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {visibleOrders.map((order) =>
                  order.category === 'conditional' ? (
                    <ContractTpSlOrderCard
                      key={order.id}
                      order={order}
                      onCancel={() => cancelOrder(order.id)}
                    />
                  ) : (
                    <ContractOpenOrderCard
                      key={order.id}
                      order={order}
                      onCancel={() => cancelOrder(order.id)}
                    />
                  ),
                )}
              </div>
            )}
          </>
        )}

        {tab !== 'open' && <EmptyState />}
      </SubPageLayout>
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
      className={`rounded-full px-3 py-1.5 text-caption font-medium ${
        active
          ? 'bg-sunken text-primary'
          : 'text-secondary active:opacity-70'
      }`}
    >
      {label}
    </button>
  )
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-1 rounded-md bg-sunken px-2.5 py-1.5 text-caption text-secondary"
    >
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <PackageOpen className="h-12 w-12 text-secondary" strokeWidth={1.25} />
      <p className="mt-4 text-body-sm text-secondary">暂无数据</p>
    </div>
  )
}
