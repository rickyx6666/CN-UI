import { ChevronRight } from 'lucide-react'
import type { ContractFillRecord } from '../../data/contractRecords'
import { formatUsd } from '../../data/mock'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractFillRecordCardProps {
  fill: ContractFillRecord
}

export function ContractFillRecordCard({ fill }: ContractFillRecordCardProps) {
  const actionLabel =
    fill.intent === 'open'
      ? fill.side === 'long'
        ? '开多'
        : '开空'
      : fill.side === 'long'
        ? '平多'
        : '平空'
  const tone = fill.intent === 'open' && fill.side === 'long' ? 'success' : fill.intent === 'open' && fill.side === 'short' ? 'danger' : fill.intent === 'close' && fill.side === 'long' ? 'danger' : 'success'

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-body-sm font-semibold text-primary">
          {fill.symbol}USDT 永续
        </h3>
        <button
          type="button"
          className="flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums text-secondary active:opacity-70"
        >
          <time>{formatTradeRecordTime(fill.filledAt)}</time>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-2.5">
        <span
          className={`text-caption font-medium ${
            tone === 'success' ? 'text-success' : 'text-danger'
          }`}
        >
          {actionLabel}
        </span>
      </div>

      <div className="space-y-1.5">
        <DetailRow label={`成交数量 (${fill.symbol})`} value={formatQty(fill.size)} />
        <DetailRow label="成交价格" value={formatPrice(fill.price)} />
        <DetailRow label="手续费 (USDT)" value={formatUsd(fill.fee)} />
        <DetailRow label="角色" value={fill.role === 'maker' ? '挂单' : '吃单'} />
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

function formatPrice(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}
