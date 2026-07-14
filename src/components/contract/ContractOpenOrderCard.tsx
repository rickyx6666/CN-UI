import { Share2 } from 'lucide-react'
import {
  contractOrderSideLabel,
  contractOrderSideTone,
  type ContractBasicOrder,
} from '../../data/contract'
import { formatUsd } from '../../data/mock'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractOpenOrderCardProps {
  order: ContractBasicOrder
  onCancel?: () => void
}

export function ContractOpenOrderCard({
  order,
  onCancel,
}: ContractOpenOrderCardProps) {
  const tone = contractOrderSideTone(order)
  const sideLabel = contractOrderSideLabel(order)

  return (
    <article className="border-b border-border-subtle py-4 last:border-b-0">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <h3 className="truncate text-body-sm font-semibold text-primary">
            {order.symbol}USDT 永续
          </h3>
          <button
            type="button"
            aria-label="分享"
            className="flex h-6 w-6 shrink-0 items-center justify-center text-secondary active:opacity-70"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-caption tabular-nums text-secondary">
            {order.fillPercent}%
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-border-subtle px-2.5 py-1 text-[10px] font-medium text-primary active:bg-sunken"
            >
              撤单
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
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

      <div className="space-y-2">
        <DetailRow
          label={`成交数量 / 数量 (${order.symbol})`}
          value={`${order.filled.toFixed(3)} / ${order.size.toFixed(3)}`}
        />
        <DetailRow
          label="价格"
          value={
            order.orderType === 'market'
              ? '市价'
              : formatUsd(order.price)
          }
        />
      </div>
    </article>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-caption">
      <span className="text-secondary">{label}</span>
      <span className="tabular-nums text-primary">{value}</span>
    </div>
  )
}
