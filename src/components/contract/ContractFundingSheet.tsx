import { BottomSheet } from '../sheets/BottomSheet'
import type { ContractFundingDetail } from '../../data/contract'

interface ContractFundingSheetProps {
  open: boolean
  onClose: () => void
  detail: ContractFundingDetail
}

export function ContractFundingSheet({
  open,
  onClose,
  detail,
}: ContractFundingSheetProps) {
  const feePositive = detail.estimatedFeeUsdt >= 0

  return (
    <BottomSheet title="资金费率" open={open} onClose={onClose}>
      <dl className="space-y-3">
        <FundingRow label="时间周期" value={`${detail.intervalHours}时`} />
        <FundingRow
          label="资金费率上限/下限"
          value={`${detail.rateCapPercent} / ${detail.rateFloorPercent}`}
        />
        <FundingRow
          label="前一次资金费率 / 年化"
          value={`${detail.previousRatePercent} / ${detail.previousAnnualizedPercent}`}
        />
        <FundingRow
          label="预期资金费率 / 年化"
          value={`${detail.expectedRatePercent} / ${detail.expectedAnnualizedPercent}`}
        />
        <FundingRow
          label="预估资金费用"
          value={`${feePositive ? '' : '−'}${Math.abs(detail.estimatedFeeUsdt).toFixed(4)} USDT`}
          valueClassName={feePositive ? 'text-primary' : 'text-danger'}
        />
        <div className="flex items-center justify-between gap-3 text-body-sm">
          <dt className="text-secondary">方向</dt>
          <dd>
            {detail.direction === 'long_pays_short' ? (
              <span>
                <span className="text-success">多头</span>
                <span className="text-primary"> 支付 </span>
                <span className="text-danger">空头</span>
              </span>
            ) : (
              <span>
                <span className="text-danger">空头</span>
                <span className="text-primary"> 支付 </span>
                <span className="text-success">多头</span>
              </span>
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-caption leading-relaxed text-secondary">
        多空两方向持仓者在下次资金费率时间点交换资金费用。费率为正，多头支付空头。费率为负，空头支付多头。
      </p>
    </BottomSheet>
  )
}

function FundingRow({
  label,
  value,
  valueClassName = 'text-primary',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-body-sm">
      <dt className="shrink-0 text-secondary">{label}</dt>
      <dd className={`text-right tabular-nums ${valueClassName}`}>{value}</dd>
    </div>
  )
}
