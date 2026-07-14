import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import {
  contractTpSlLabel,
  contractTpSlTone,
  contractTpSlTriggerLabel,
  type ContractTpSlOrder,
} from '../../data/contract'
import { formatUsd } from '../../data/mock'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractTpSlOrderCardProps {
  order: ContractTpSlOrder
  onCancel?: () => void
  onEdit?: () => void
}

export function ContractTpSlOrderCard({
  order,
  onCancel,
  onEdit,
}: ContractTpSlOrderCardProps) {
  const tone = contractTpSlTone(order)
  const sideLabel = contractTpSlLabel(order)
  const priceLabel = order.orderPrice == null ? '市价' : formatUsd(order.orderPrice)

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="min-w-0 truncate text-body-sm font-semibold text-primary">
          {order.symbol}USDT 永续
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="shrink-0 rounded-md border border-border-subtle px-2 py-1 text-[10px] font-medium text-primary active:bg-sunken"
          >
            撤单
          </button>
        )}
      </div>

      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span
          className={`text-caption font-medium ${
            tone === 'success' ? 'text-success' : 'text-danger'
          }`}
        >
          {sideLabel}
        </span>
        <time className="text-[10px] tabular-nums text-secondary">
          {formatTradeRecordTime(order.createdAt)}
        </time>
      </div>

      <div className="space-y-1.5">
        <DetailRow label="价格" value={priceLabel} />
        <DetailRow
          label="触发类型"
          value={contractTpSlTriggerLabel(order)}
          trailing={
            <button
              type="button"
              aria-label="编辑触发类型"
              onClick={onEdit}
              className="flex h-4 w-4 items-center justify-center text-secondary active:opacity-70"
            >
              <Pencil className="h-3 w-3" strokeWidth={1.5} />
            </button>
          }
        />
        <DetailRow label="只减仓" value={order.reduceOnly ? '是' : '否'} />
      </div>
    </article>
  )
}

function DetailRow({
  label,
  value,
  trailing,
}: {
  label: string
  value: string
  trailing?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <span className="text-secondary">{label}</span>
      <div className="flex items-center gap-1 tabular-nums text-primary">
        <span>{value}</span>
        {trailing}
      </div>
    </div>
  )
}
