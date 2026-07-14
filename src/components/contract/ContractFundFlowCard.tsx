import { ChevronRight } from 'lucide-react'
import {
  contractFundFlowLabel,
  type ContractFundFlowRecord,
} from '../../data/contractRecords'
import { formatUsd } from '../../data/mock'
import { formatTradeRecordTime } from '../../data/trade'

interface ContractFundFlowCardProps {
  record: ContractFundFlowRecord
}

export function ContractFundFlowCard({ record }: ContractFundFlowCardProps) {
  const positive = record.amount >= 0
  const title = record.symbol
    ? `${record.symbol}USDT 永续`
    : contractFundFlowLabel(record.type)

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate text-body-sm font-semibold text-primary">{title}</h3>
        <button
          type="button"
          className="flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums text-secondary active:opacity-70"
        >
          <time>{formatTradeRecordTime(record.createdAt)}</time>
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-2.5">
        <span className="text-caption font-medium text-secondary">
          {contractFundFlowLabel(record.type)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-[10px]">
        <span className="text-secondary">金额 ({record.asset})</span>
        <span
          className={`text-body-sm font-semibold tabular-nums ${
            positive ? 'text-success' : 'text-danger'
          }`}
        >
          {positive ? '+' : ''}
          {formatUsd(record.amount)}
        </span>
      </div>
    </article>
  )
}
