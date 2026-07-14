import { FileClock } from 'lucide-react'
import { contractPortfolioSummary, contractPositions } from '../../data/contract'
import { formatUsd } from '../../data/mock'
import { usePrototype } from '../../context/PrototypeContext'
import { ContractPositionCard } from './ContractPositionCard'

export function ContractAssetsPanel() {
  const { openContractHistory } = usePrototype()
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
          aria-label="合约账单"
          onClick={openContractHistory}
          className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
        >
          <FileClock className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>

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
