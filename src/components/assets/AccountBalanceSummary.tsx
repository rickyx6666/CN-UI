import { ChevronDown, ChevronRight, Eye, EyeOff, History } from 'lucide-react'
import { useState } from 'react'
import { approximateCny } from '../../data/assets'
import { formatChangePercent, formatUsd } from '../../data/mock'

export interface AccountBalanceAction {
  label: string
  variant: 'primary' | 'secondary'
  onClick: () => void
}

interface AccountBalanceSummaryProps {
  label: string
  balanceUsd: number
  pnlUsd?: number
  pnlPercent?: number
  actions: AccountBalanceAction[]
  onHistoryClick?: () => void
  onLabelClick?: () => void
}

export function AccountBalanceSummary({
  label,
  balanceUsd,
  pnlUsd = 0,
  pnlPercent = 0,
  actions,
  onHistoryClick,
  onLabelClick,
}: AccountBalanceSummaryProps) {
  const [visible, setVisible] = useState(true)
  const isPositive = pnlUsd >= 0

  return (
    <section className="pb-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {onLabelClick ? (
            <button
              type="button"
              onClick={onLabelClick}
              className="border-b border-dashed border-secondary text-body-sm text-secondary active:opacity-70"
            >
              {label}
            </button>
          ) : (
            <span className="text-body-sm text-secondary">{label}</span>
          )}
          <button
            type="button"
            aria-label={visible ? '隐藏余额' : '显示余额'}
            onClick={() => setVisible((value) => !value)}
            className="flex h-7 w-7 items-center justify-center text-secondary active:opacity-70"
          >
            {visible ? (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
        {onHistoryClick && (
          <button
            type="button"
            aria-label="历史记录"
            onClick={onHistoryClick}
            className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
          >
            <History className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="mb-1 flex items-end gap-1.5">
        <p className="tabular-nums text-[32px] font-semibold leading-none tracking-tight text-primary">
          {visible ? formatUsd(balanceUsd) : '••••••'}
        </p>
        {visible && (
          <button
            type="button"
            className="mb-1 inline-flex items-center gap-0.5 text-body-sm font-medium text-primary active:opacity-70"
          >
            <span>USDT</span>
            <ChevronDown className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <p className="tabular-nums text-caption text-secondary">
        {visible ? approximateCny(balanceUsd) : '••••'}
      </p>

      <button
        type="button"
        className="mt-2 inline-flex items-center gap-0.5 text-body-sm active:opacity-70"
      >
        <span className="text-secondary">今日盈亏</span>
        <span
          className={`tabular-nums ${
            visible ? (isPositive ? 'text-success' : 'text-danger') : 'text-secondary'
          }`}
        >
          {visible ? (
            <>
              {isPositive ? '+' : '−'}
              {formatUsd(Math.abs(pnlUsd))} USDT ({formatChangePercent(pnlPercent)})
            </>
          ) : (
            '••••'
          )}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-secondary" strokeWidth={1.5} />
      </button>

      {actions.length > 0 && (
        <div className="mt-4 flex gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`h-11 min-w-0 flex-1 rounded-md text-body-sm font-medium active:opacity-90 ${
                action.variant === 'primary'
                  ? 'bg-brand font-semibold text-brand-dark active:bg-brand-hover'
                  : 'border border-border bg-sunken text-primary active:bg-elevated'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
