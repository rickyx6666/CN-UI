import { ChevronRight } from 'lucide-react'
import {
  contractHistoryOrderLabel,
  contractHistoryOrderTone,
  contractHistoryPriceLabel,
  contractHistoryStatusLabel,
  contractHistoryStatusTone,
  type ContractHistoryOrder,
} from '../../data/contractRecords'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractHistoryOrderCardProps {
  order: ContractHistoryOrder
  onOpenDetail?: () => void
}

export function ContractHistoryOrderCard({
  order,
  onOpenDetail,
}: ContractHistoryOrderCardProps) {
  const tone = contractHistoryOrderTone(order)
  const sideLabel = contractHistoryOrderLabel(order)

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-body-sm font-semibold text-primary">
          {order.symbol}USDT 永续
        </h3>
        <button
          type="button"
          onClick={onOpenDetail}
          className="flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums text-secondary active:opacity-70"
        >
          <time>{formatTradeRecordTime(order.createdAt)}</time>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-2.5">
        <span
          className={`text-caption font-medium ${
            tone === 'success' ? 'text-success' : 'text-danger'
          }`}
        >
          {sideLabel}
        </span>
      </div>

      <div className="space-y-1.5">
        <DetailRow
          label={`数量 (${order.symbol})`}
          value={`${formatQty(order.filled)} / ${formatQty(order.size)}`}
        />
        <DetailRow label="价格" value={contractHistoryPriceLabel(order)} />
        {order.reduceOnly && <DetailRow label="只减仓" value="是" />}
      </div>

      <div className="mt-2 flex justify-end">
        <span
          className={`text-caption font-medium ${contractHistoryStatusTone(order.status)}`}
        >
          {contractHistoryStatusLabel(order.status)}
        </span>
      </div>
    </article>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <span className="text-secondary">{label}</span>
      <span className="tabular-nums text-primary">{value}</span>
    </div>
  )
}

function formatQty(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(3).replace(/\.?0+$/, '')
}
