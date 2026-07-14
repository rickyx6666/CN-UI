import { ChevronRight } from 'lucide-react'
import {
  contractPortfolioSummary,
  contractPositions,
} from '../../data/contract'
import { formatUsd } from '../../data/mock'
import { usePrototype } from '../../context/PrototypeContext'

export function ContractAssetsPanel() {
  const { setActiveTab, setProductModule } = usePrototype()
  const { equityUsd, availableMarginUsd, unrealizedPnlUsd, marginRatioPercent } =
    contractPortfolioSummary
  const isPositive = unrealizedPnlUsd >= 0

  return (
    <section className="pb-4">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <MetricCard label="账户权益 (USD)" value={`$${formatUsd(equityUsd)}`} />
        <MetricCard
          label="可用保证金"
          value={`$${formatUsd(availableMarginUsd)}`}
        />
        <MetricCard
          label="未实现盈亏"
          value={`${isPositive ? '+' : '−'}$${formatUsd(Math.abs(unrealizedPnlUsd))}`}
          valueClassName={isPositive ? 'text-success' : 'text-danger'}
        />
        <MetricCard
          label="保证金率"
          value={`${marginRatioPercent}%`}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-body-sm font-medium text-secondary">当前持仓</h2>
        <button
          type="button"
          onClick={() => {
            setProductModule('contract')
            setActiveTab('trade')
          }}
          className="text-caption text-brand"
        >
          去交易
        </button>
      </div>

      <ul className="divide-y divide-border-subtle">
        {contractPositions.map((position) => {
          const positionPositive = position.pnlUsd >= 0
          return (
            <li key={position.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-body font-medium text-primary">
                    {position.symbol}USDT 永续
                    <span
                      className={`ml-2 text-caption ${
                        position.side === 'long' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {position.side === 'long' ? '多' : '空'} · {position.leverage}x
                    </span>
                  </p>
                  <p className="mt-1 text-caption text-secondary">
                    数量 {position.size} · 保证金 ${formatUsd(position.marginUsd)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`tabular-nums text-body-sm ${
                      positionPositive ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {positionPositive ? '+' : '−'}$
                    {formatUsd(Math.abs(position.pnlUsd))}
                  </p>
                  <p className="mt-1 tabular-nums text-caption text-secondary">
                    {formatUsd(position.entryPrice)} → {formatUsd(position.markPrice)}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        className="mt-3 flex min-h-11 w-full items-center justify-between rounded-lg border border-border-subtle bg-elevated px-4 text-left active:bg-sunken"
      >
        <span className="text-body-sm text-primary">合约账单</span>
        <ChevronRight className="h-4 w-4 text-secondary" />
      </button>
    </section>
  )
}

function MetricCard({
  label,
  value,
  valueClassName = 'text-primary',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-elevated px-3 py-3">
      <p className="text-caption text-secondary">{label}</p>
      <p className={`mt-1 tabular-nums text-body-sm font-medium ${valueClassName}`}>
        {value}
      </p>
    </div>
  )
}
