import { Share2 } from 'lucide-react'
import { contractMarginModeLabel } from '../../data/contract'
import { contractShareFromClosed } from '../../data/contractShare'
import {
  contractPositionHistoryStatusLabel,
  formatContractRecordTime,
  type ContractPositionHistory,
} from '../../data/contractRecords'
import { formatUsd } from '../../data/mock'
import { useContractPositionShare } from './ContractPositionShareContext'

interface ContractPositionHistoryCardProps {
  position: ContractPositionHistory
}

export function ContractPositionHistoryCard({
  position,
}: ContractPositionHistoryCardProps) {
  const { openContractPositionShare } = useContractPositionShare()
  const isLong = position.side === 'long'
  const positivePnl = position.realizedPnl >= 0
  const positiveRoe = position.roePercent >= 0

  return (
    <article className="border-b border-border-subtle py-3 last:border-b-0">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-white ${
              isLong ? 'bg-success' : 'bg-danger'
            }`}
          >
            {isLong ? '多' : '空'}
          </span>
          <p className="truncate text-body-sm font-medium text-primary">
            {position.symbol}USDT 永续{' '}
            <span className="font-normal text-secondary">
              {contractMarginModeLabel(position.marginMode)} {position.leverage}X
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="text-[10px] text-secondary">
            {contractPositionHistoryStatusLabel(position.status)}
          </span>
          <button
            type="button"
            aria-label="分享"
            onClick={() =>
              openContractPositionShare(contractShareFromClosed(position))
            }
            className="flex h-6 w-6 items-center justify-center text-secondary active:opacity-70"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-x-2 gap-y-2.5">
        <Metric
          label="已实现盈亏 (USDT)"
          value={`${positivePnl ? '+' : ''}${formatUsd(position.realizedPnl)}`}
          valueClassName={positivePnl ? 'text-success' : 'text-danger'}
        />
        <Metric
          label="投资回报率"
          value={`${positiveRoe ? '+' : ''}${position.roePercent.toFixed(2)}%`}
          valueClassName={positiveRoe ? 'text-success' : 'text-danger'}
        />
        <Metric
          label={`已平仓量 (${position.symbol})`}
          value={formatQty(position.closedSize)}
          align="right"
        />
        <Metric
          label="开仓价格"
          value={formatPrice(position.entryPrice)}
        />
        <Metric
          label="平仓均价"
          value={formatPrice(position.closePrice)}
        />
        <Metric
          label={`最高 OI (${position.symbol})`}
          value={formatQty(position.maxOpenInterest)}
          align="right"
        />
      </div>

      <div className="space-y-1 text-left text-[10px] tabular-nums text-secondary">
        <p>
          <span className="text-secondary">开仓时间 </span>
          {formatContractRecordTime(position.openedAt)}
        </p>
        <p>
          <span className="text-secondary">全部平仓时间 </span>
          {formatContractRecordTime(position.closedAt)}
        </p>
      </div>
    </article>
  )
}

function Metric({
  label,
  value,
  valueClassName = 'text-primary',
  align = 'left',
}: {
  label: string
  value: string
  valueClassName?: string
  align?: 'left' | 'right'
}) {
  return (
    <div className={align === 'right' ? 'text-right' : 'min-w-0'}>
      <p className="truncate text-[9px] leading-tight text-secondary">{label}</p>
      <p
        className={`mt-0.5 text-[11px] font-medium tabular-nums ${valueClassName}`}
      >
        {value}
      </p>
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
    maximumFractionDigits: 2,
  })
}
