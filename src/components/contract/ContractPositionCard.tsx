import { Pencil, Share2 } from 'lucide-react'
import type { ContractPosition } from '../../data/contract'
import { contractMarginModeLabel, contractMarginRatioClass } from '../../data/contract'
import { formatUsd } from '../../data/mock'

interface ContractPositionCardProps {
  position: ContractPosition
  readOnly?: boolean
}

export function ContractPositionCard({
  position,
  readOnly = false,
}: ContractPositionCardProps) {
  const isLong = position.side === 'long'
  const positive = position.pnlUsd >= 0

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
        {!readOnly && (
          <button
            type="button"
            aria-label="分享"
            className="flex h-7 w-7 shrink-0 items-center justify-center text-secondary active:opacity-70"
          >
            <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-x-2">
        <div className="col-span-2 min-w-0">
          <p className="text-[10px] text-secondary">未实现盈亏 (USDT)</p>
          <p
            className={`mt-0.5 text-body font-semibold tabular-nums ${
              positive ? 'text-success' : 'text-danger'
            }`}
          >
            {positive ? '+' : ''}
            {formatUsd(position.pnlUsd)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-secondary">投资回报率</p>
          <p
            className={`mt-0.5 text-body font-semibold tabular-nums ${
              position.roePercent >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {position.roePercent >= 0 ? '+' : ''}
            {position.roePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-x-2 gap-y-2.5">
        <Metric label={`持仓数量 (${position.symbol})`} value={position.size.toFixed(3)} />
        <Metric label="保证金 (USDT)" value={formatUsd(position.marginUsd)} />
        <Metric
          label="保证金比率"
          value={`${position.marginRatioPercent.toFixed(2)}%`}
          valueClassName={contractMarginRatioClass(position.marginRatioPercent)}
          align="right"
        />
        <Metric label="开仓价格 (USDT)" value={formatUsd(position.entryPrice)} />
        <Metric label="标记价格 (USDT)" value={formatUsd(position.markPrice)} />
        <Metric
          label="强平价格 (USDT)"
          value={formatUsd(position.liquidationPrice)}
          align="right"
        />
      </div>

      <div
        className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] ${
          readOnly ? '' : 'mb-3'
        }`}
      >
        <span className="text-secondary">仓位止盈止损</span>
        <div className="flex items-center gap-1.5 tabular-nums leading-none">
          <span className="text-success">
            {formatUsd(position.takeProfitPrice)}
          </span>
          <span className="text-secondary">/</span>
          <span className="text-danger">
            {formatUsd(position.stopLossPrice)}
          </span>
          {!readOnly && (
            <button
              type="button"
              aria-label="编辑止盈止损"
              className="flex h-4 w-4 shrink-0 items-center justify-center text-secondary active:opacity-70"
            >
              <Pencil className="h-3 w-3" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {!readOnly && (
        <div className="grid grid-cols-3 gap-2">
          {['杠杆', '止盈/止损', '平仓'].map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-md bg-sunken py-2 text-[10px] font-medium text-primary active:opacity-80"
            >
              {label}
            </button>
          ))}
        </div>
      )}
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
