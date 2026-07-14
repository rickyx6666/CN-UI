import { useMemo, useState } from 'react'
import { ChevronDown, CircleHelp, Filter, PackageOpen } from 'lucide-react'
import { ContractFillRecordCard } from '../../components/contract/ContractFillRecordCard'
import { ContractFundFlowCard } from '../../components/contract/ContractFundFlowCard'
import { ContractFundingFeeCard } from '../../components/contract/ContractFundingFeeCard'
import { ContractHistoryOrderCard } from '../../components/contract/ContractHistoryOrderCard'
import { ContractOpenOrderCard } from '../../components/contract/ContractOpenOrderCard'
import { useContractOrderEdit } from '../../components/contract/ContractOrderEditContext'
import { ContractPositionHistoryCard } from '../../components/contract/ContractPositionHistoryCard'
import { ContractTpSlOrderCard } from '../../components/contract/ContractTpSlOrderCard'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import {
  contractOpenOrderCount,
  contractOpenOrders,
  type ContractOrderCategory,
} from '../../data/contract'
import {
  contractFillRecords,
  contractFundFlowRecords,
  contractFundingFeeRecords,
  contractHistoryOrders,
  contractPositionHistory,
  contractPositionHistoryUpdatedAt,
  formatContractRecordTime,
} from '../../data/contractRecords'
import { recordsCopy } from '../../data/records'
import { usePrototype } from '../../context/PrototypeContext'

type RecordTab =
  | 'open'
  | 'history'
  | 'positions'
  | 'fills'
  | 'fund'
  | 'funding'

const mainTabs: { id: RecordTab; label: string }[] = [
  { id: 'open', label: `当前委托(${contractOpenOrderCount})` },
  { id: 'history', label: '历史委托' },
  { id: 'positions', label: '仓位历史' },
  { id: 'fills', label: '历史成交' },
  { id: 'fund', label: '资金流水' },
  { id: 'funding', label: '资金费用' },
]

export function ContractRecordsPage() {
  const { closeRecords, navigateRecords } = usePrototype()
  const { openContractOrderEdit } = useContractOrderEdit()
  const [tab, setTab] = useState<RecordTab>('open')
  const [subTab, setSubTab] = useState<ContractOrderCategory>('basic')
  const [orders, setOrders] = useState(contractOpenOrders)

  const basicCount = orders.filter((o) => o.category === 'basic').length
  const conditionalCount = orders.filter((o) => o.category === 'conditional').length

  const visibleOrders = useMemo(() => {
    if (tab !== 'open') return []
    return orders.filter((order) => order.category === subTab)
  }, [orders, subTab, tab])

  const visibleHistoryOrders = useMemo(() => {
    if (tab !== 'history') return []
    return contractHistoryOrders.filter((order) => order.category === subTab)
  }, [subTab, tab])

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  const cancelAll = () => {
    setOrders((prev) => prev.filter((order) => order.category !== subTab))
  }

  const confirmBasicEdit = (
    orderId: string,
    values: { price: number; size: number },
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.category === 'basic'
          ? { ...order, price: values.price, size: values.size }
          : order,
      ),
    )
  }

  const confirmConditionalEdit = (
    orderId: string,
    values: { triggerPrice: number },
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.category === 'conditional'
          ? { ...order, triggerPrice: values.triggerPrice }
          : order,
      ),
    )
  }

  const showOrderSubTabs = tab === 'open' || tab === 'history'

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

        {showOrderSubTabs && (
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SubTabChip
                label={
                  tab === 'open' ? `基础单(${basicCount})` : '基础单'
                }
                active={subTab === 'basic'}
                onClick={() => setSubTab('basic')}
              />
              <SubTabChip
                label={
                  tab === 'open'
                    ? `条件委托(${conditionalCount})`
                    : '条件委托'
                }
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
        )}

        {tab === 'open' && (
          <>
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
          </>
        )}

        {tab === 'history' && (
          <>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <FilterChip label="合约" />
              <FilterChip label="订单类型" />
              <FilterChip label="方向" />
              <FilterChip label="状态" />
              <button
                type="button"
                aria-label="筛选"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-brand active:opacity-70"
              >
                <Filter className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {visibleHistoryOrders.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {visibleHistoryOrders.map((order) => (
                  <ContractHistoryOrderCard
                    key={order.id}
                    order={order}
                    onOpenDetail={() =>
                      navigateRecords({
                        screen: 'contract-order-detail',
                        orderId: order.id,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'positions' && (
          <>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <FilterChip label="合约" />
              <FilterChip label="仓位模式" />
              <FilterChip label="状态" />
              <button
                type="button"
                aria-label="筛选"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-brand active:opacity-70"
              >
                <Filter className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <p className="mb-3 text-[10px] leading-relaxed text-secondary">
              更新时间 {formatContractRecordTime(contractPositionHistoryUpdatedAt)}
              <br />
              数据可能存在延迟，仅供参考
            </p>

            {contractPositionHistory.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div>
                  {contractPositionHistory.map((position) => (
                    <ContractPositionHistoryCard
                      key={position.id}
                      position={position}
                    />
                  ))}
                </div>
                <p className="py-6 text-center text-caption text-secondary">
                  已经全部加载完毕
                </p>
              </>
            )}
          </>
        )}

        {tab === 'fills' && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <FilterChip label="合约" />
              <FilterChip label="方向" />
              <button
                type="button"
                aria-label="筛选"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-brand active:opacity-70"
              >
                <Filter className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {contractFillRecords.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {contractFillRecords.map((fill) => (
                  <ContractFillRecordCard key={fill.id} fill={fill} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'fund' && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <FilterChip label="类型" />
              <FilterChip label="时间" />
              <button
                type="button"
                aria-label="筛选"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-brand active:opacity-70"
              >
                <Filter className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {contractFundFlowRecords.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {contractFundFlowRecords.map((record) => (
                  <ContractFundFlowCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'funding' && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <FilterChip label="合约" />
              <FilterChip label="方向" />
              <button
                type="button"
                aria-label="筛选"
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-brand active:opacity-70"
              >
                <Filter className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {contractFundingFeeRecords.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {contractFundingFeeRecords.map((record) => (
                  <ContractFundingFeeCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </>
        )}
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
