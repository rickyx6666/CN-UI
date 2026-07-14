import { CoinNovaLogo } from '../CoinNovaLogo'
import {
  contractShareHeadline,
  contractSharePnlLabel,
  contractShareSideLabel,
  contractShareStatusLabel,
  type ContractPositionSharePayload,
} from '../../data/contractShare'
import { formatContractRecordTime } from '../../data/contractRecords'
import { referralSummary } from '../../data/referral'
import { formatUsd } from '../../data/mock'

interface ContractPositionShareCardProps {
  payload: ContractPositionSharePayload
}

export function ContractPositionShareCard({ payload }: ContractPositionShareCardProps) {
  const positive = payload.pnlUsd >= 0
  const positiveRoe = payload.roePercent >= 0

  return (
    <div
      className="relative w-full max-w-[320px] overflow-hidden rounded-2xl shadow-lg"
      data-share-card
    >
      <div
        className={`relative px-5 pb-5 pt-6 ${
          positiveRoe
            ? 'bg-[linear-gradient(145deg,#0f2a1d_0%,#0a0a0a_55%,#111111_100%)]'
            : 'bg-[linear-gradient(145deg,#2a1010_0%,#0a0a0a_55%,#111111_100%)]'
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl ${
            positiveRoe ? 'bg-success/20' : 'bg-danger/20'
          }`}
        />

        <div className="relative flex items-center justify-between">
          <CoinNovaLogo size={28} />
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
            {contractShareStatusLabel(payload.kind)}
          </span>
        </div>

        <div className="relative mt-5 flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-[11px] font-semibold text-white ${
              payload.side === 'long' ? 'bg-success' : 'bg-danger'
            }`}
          >
            {contractShareSideLabel(payload.side)}
          </span>
          <p className="truncate text-[13px] font-medium text-white/90">
            {payload.symbol}USDT 永续
          </p>
          <span className="shrink-0 text-[11px] text-white/50">
            {payload.leverage}X
          </span>
        </div>

        <div className="relative mt-6 text-center">
          <p
            className={`text-[40px] font-bold leading-none tabular-nums tracking-tight ${
              positiveRoe ? 'text-success' : 'text-danger'
            }`}
          >
            {positiveRoe ? '+' : ''}
            {payload.roePercent.toFixed(2)}%
          </p>
          <p className="mt-2 text-[12px] text-white/50">投资回报率</p>
        </div>

        <div className="relative mt-5 rounded-xl bg-white/5 px-4 py-3">
          <p className="text-[11px] text-white/45">{contractSharePnlLabel(payload.kind)}</p>
          <p
            className={`mt-1 text-[18px] font-semibold tabular-nums ${
              positive ? 'text-success' : 'text-danger'
            }`}
          >
            {positive ? '+' : ''}
            {formatUsd(payload.pnlUsd)} USDT
          </p>
        </div>

        <dl className="relative mt-4 grid grid-cols-2 gap-3 text-[12px]">
          <ShareMetric label="开仓价格" value={formatPrice(payload.entryPrice)} />
          <ShareMetric
            label={payload.comparePriceLabel}
            value={formatPrice(payload.comparePrice)}
            align="right"
          />
        </dl>

        <p className="relative mt-4 text-[11px] leading-relaxed text-white/40">
          {contractShareHeadline(payload)}
        </p>

        <div className="relative mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] text-white/40">邀请码</p>
            <p className="mt-0.5 text-[15px] font-semibold tracking-wide text-brand">
              {referralSummary.inviteCode}
            </p>
            <p className="mt-1 text-[10px] text-white/35">扫码注册，一起交易</p>
          </div>
          <ShareQrCode seed={referralSummary.inviteLink} size={72} />
        </div>

        <p className="relative mt-4 text-center text-[10px] tabular-nums text-white/30">
          {formatContractRecordTime(payload.timestamp)}
        </p>
      </div>
    </div>
  )
}

function ShareMetric({
  label,
  value,
  align = 'left',
}: {
  label: string
  value: string
  align?: 'left' | 'right'
}) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <dt className="text-white/40">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums text-white/90">{value}</dd>
    </div>
  )
}

function ShareQrCode({ seed, size }: { seed: string; size: number }) {
  const grid = 7
  const cells = grid * grid

  return (
    <div
      className="rounded-lg bg-white p-1.5"
      style={{ width: size, height: size }}
    >
      <div
        className="grid h-full w-full gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
      >
        {Array.from({ length: cells }).map((_, index) => {
          const filled = (index + seed.length) % 3 !== 0
          return (
            <span
              key={index}
              className={`block ${filled ? 'bg-[#0A0A0A]' : 'bg-transparent'}`}
            />
          )
        })}
      </div>
    </div>
  )
}

function formatPrice(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
