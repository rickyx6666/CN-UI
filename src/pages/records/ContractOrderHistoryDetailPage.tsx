import type { ReactNode } from 'react'
import { CheckCircle2, Headphones, XCircle } from 'lucide-react'
import { CopyButton } from '../../components/common/CopyButton'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { usePrototype } from '../../context/PrototypeContext'
import {
  contractHistoryDetailStatusLabel,
  contractHistoryFillRoleLabel,
  contractHistoryOrderLabel,
  contractHistoryOrderTone,
  formatContractRecordTime,
  getContractHistoryOrder,
  type ContractHistoryOrder,
} from '../../data/contractRecords'

export function ContractOrderHistoryDetailPage() {
  const { recordsScreen, navigateRecords } = usePrototype()
  const order = getContractHistoryOrder(recordsScreen?.orderId ?? '')

  if (!order) return null

  function handleBack() {
    navigateRecords({ screen: 'contract-records' })
  }

  return (
    <SubPageLayout
      title={
        <span className="inline-flex items-center gap-1.5">
          <span>{order.symbol}USDT</span>
          <span className="rounded bg-sunken px-1.5 py-0.5 text-[10px] font-normal text-secondary">
            永续
          </span>
        </span>
      }
      onBack={handleBack}
      headerRight={
        <button
          type="button"
          aria-label="客服"
          className="flex h-11 w-11 items-center justify-center text-primary active:opacity-70"
        >
          <Headphones className="h-5 w-5" strokeWidth={1.5} />
        </button>
      }
    >
      <StatusBanner order={order} />

      <div className="mt-6 space-y-3 text-body-sm">
        <DetailRow
          label="订单号"
          value={
            <span className="inline-flex items-center gap-1">
              <span className="tabular-nums">{order.orderNo}</span>
              <CopyButton value={order.orderNo} iconOnly className="px-1 py-0.5" />
            </span>
          }
        />
        <DetailRow
          label="类型"
          value={contractHistoryOrderLabel(order)}
          valueClassName={
            contractHistoryOrderTone(order) === 'success'
              ? 'text-success'
              : 'text-danger'
          }
        />
        {order.status === 'cancelled' ? (
          <DetailRow
            label={`数量 / 成交数量 (${order.symbol})`}
            value={`${formatQty(order.filled)} / ${formatQty(order.size)}`}
          />
        ) : (
          <DetailRow
            label={`成交数量 (${order.symbol})`}
            value={formatQty(order.filled)}
          />
        )}
        <DetailRow
          label="均价 / 价格"
          value={formatDetailPrice(order)}
        />
        {order.reduceOnly && <DetailRow label="只减仓" value="是" />}
      </div>

      <div className="my-4 h-px bg-border-subtle" />

      <div className="space-y-3 text-body-sm">
        <DetailRow
          label="手续费"
          value={formatFee(order.fee)}
        />
        <DetailRow
          label="已实现盈亏"
          value={`${formatFixed(order.realizedPnl ?? 0, 8)} USDT`}
        />
        <DetailRow
          label="创建时间"
          value={formatContractRecordTime(order.createdAt)}
        />
        <DetailRow
          label={order.status === 'cancelled' ? '撤销时间' : '更新时间'}
          value={formatContractRecordTime(
            order.status === 'cancelled'
              ? (order.cancelledAt ?? order.updatedAt)
              : order.updatedAt,
          )}
        />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-body font-semibold text-primary">成交明细</h2>
        {order.fills && order.fills.length > 0 ? (
          <div className="space-y-5">
            {order.fills.map((fill) => (
              <div key={fill.id} className="space-y-2.5 text-body-sm">
                <DetailRow
                  label="日期"
                  value={formatContractRecordTime(fill.filledAt)}
                />
                <DetailRow
                  label="数量"
                  value={`${formatQty(fill.size)} ${order.symbol}`}
                />
                <DetailRow
                  label="价格"
                  value={`${formatFixed(fill.price, 4)} USDT`}
                />
                <DetailRow
                  label="已实现盈亏"
                  value={`${formatFixed(fill.realizedPnl, 8)} USDT`}
                />
                <DetailRow
                  label="手续费"
                  value={`${formatFixed(fill.fee, 8)} USDT`}
                />
                <DetailRow
                  label="角色"
                  value={contractHistoryFillRoleLabel(fill.role)}
                />
              </div>
            ))}
            <p className="py-4 text-center text-caption text-secondary">
              已经全部加载完毕
            </p>
          </div>
        ) : (
          <p className="py-8 text-center text-caption text-secondary">
            已经全部加载完毕
          </p>
        )}
      </section>
    </SubPageLayout>
  )
}

function StatusBanner({ order }: { order: ContractHistoryOrder }) {
  const isCancelled = order.status === 'cancelled'
  const statusLabel = contractHistoryDetailStatusLabel(order)

  return (
    <div className="flex flex-col items-center pt-2 text-center">
      {isCancelled ? (
        <XCircle className="h-12 w-12 text-secondary" strokeWidth={1.25} />
      ) : (
        <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.25} />
      )}
      <p
        className={`mt-3 text-body font-medium ${
          isCancelled ? 'text-secondary' : 'text-success'
        }`}
      >
        {statusLabel}
      </p>
    </div>
  )
}

function DetailRow({
  label,
  value,
  valueClassName = 'text-primary',
}: {
  label: string
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-secondary">{label}</span>
      <div className={`text-right ${valueClassName}`}>{value}</div>
    </div>
  )
}

function formatDetailPrice(order: ContractHistoryOrder): string {
  const avg =
    order.avgPrice == null
      ? '--'
      : order.avgPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })
  const price =
    order.orderPrice == null
      ? '市价'
      : order.orderPrice.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        })
  return `${avg} / ${price}`
}

function formatFee(fee: number | null | undefined): string {
  if (fee == null) return '--'
  return `${formatFixed(fee, 8)} USDT`
}

function formatFixed(value: number, digits: number): string {
  return value.toFixed(digits).replace(/\.?0+$/, '')
}

function formatQty(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(3).replace(/\.?0+$/, '')
}
