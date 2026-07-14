import {
  contractPortfolioSummary,
  contractPositions,
} from '../../data/contract'
import { approximateCny } from '../../data/assets'
import { formatUsd } from '../../data/mock'
import { ContractPositionCard } from './ContractPositionCard'

export function ContractAssetsPanel() {
  const { availableMarginUsd, unrealizedPnlUsd } = contractPortfolioSummary
  const isPositive = unrealizedPnlUsd >= 0

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <MetricCard
          label="可用保证金"
          value={`$${formatUsd(availableMarginUsd)}`}
          approxUsd={availableMarginUsd}
        />
        <MetricCard
          label="未实现盈亏"
          value={`${isPositive ? '+' : '−'}$${formatUsd(Math.abs(unrealizedPnlUsd))}`}
          valueClassName={isPositive ? 'text-success' : 'text-danger'}
          approxUsd={unrealizedPnlUsd}
          approxClassName={isPositive ? 'text-success' : 'text-danger'}
        />
      </div>

      <h2 className="mb-3 text-body-sm font-medium text-secondary">当前持仓</h2>

      <div>
        {contractPositions.length === 0 ? (
          <p className="py-8 text-center text-caption text-secondary">暂无持仓</p>
        ) : (
          contractPositions.map((position) => (
            <ContractPositionCard
              key={position.id}
              position={position}
              readOnly
            />
          ))
        )}
      </div>
    </>
  )
}

function MetricCard({
  label,
  value,
  valueClassName = 'text-primary',
  approxUsd,
  approxClassName = 'text-secondary',
}: {
  label: string
  value: string
  valueClassName?: string
  approxUsd?: number
  approxClassName?: string
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-elevated px-3 py-3">
      <p className="text-caption text-secondary">{label}</p>
      <p className={`mt-1 tabular-nums text-body-sm font-medium ${valueClassName}`}>
        {value}
      </p>
      {approxUsd != null && (
        <p className={`mt-0.5 tabular-nums text-[10px] ${approxClassName}`}>
          {approximateCny(approxUsd)}
        </p>
      )}
    </div>
  )
}
