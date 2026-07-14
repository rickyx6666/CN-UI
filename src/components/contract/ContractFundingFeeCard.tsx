import { ChevronRight } from 'lucide-react'
import type { ContractFundingFeeRecord } from '../../data/contractRecords'
import { formatUsd } from '../../data/mock'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractFundingFeeCardProps {
  record: ContractFundingFeeRecord
}

export function ContractFundingFeeCard({ record }: ContractFundingFeeCardProps) {
  const isLong = record.side === 'long'
  const positive = record.fee >= 0

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-body-sm font-semibold text-primary">
          {record.symbol}USDT 永续
        </h3>
        <button
          type="button"
          className="flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums text-secondary active:opacity-70"
        >
          <time>{formatTradeRecordTime(record.createdAt)}</time>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-2.5">
        <span
          className={`text-caption font-medium ${
            isLong ? 'text-success' : 'text-danger'
          }`}
        >
          {isLong ? '多' : '空'} · 资金费用
        </span>
      </div>

      <div className="space-y-1.5">
        <DetailRow
          label={`仓位数量 (${record.symbol})`}
          value={formatQty(record.positionSize)}
        />
        <DetailRow
          label="资金费率"
          value={`${record.ratePercent >= 0 ? '+' : ''}${record.ratePercent.toFixed(4)}%`}
        />
        <DetailRow
          label="费用 (USDT)"
          value={`${positive ? '+' : ''}${formatUsd(record.fee)}`}
          valueClassName={positive ? 'text-success' : 'text-danger'}
        />
      </div>
    </article>
  )
}

function DetailRow({
  label,
  value,
  valueClassName = 'text-primary',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[10px]">
      <span className="text-secondary">{label}</span>
      <span className={`tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  )
}

function formatQty(value: number): string {
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(3).replace(/\.?0+$/, '')
}
