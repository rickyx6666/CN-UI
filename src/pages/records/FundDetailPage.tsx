import { CheckCircle2 } from 'lucide-react'
import { CopyButton } from '../../components/common/CopyButton'
import {
  formatRecordTime,
  getFundRecord,
  recordsCopy,
} from '../../data/records'
import { formatTradeAmount } from '../../data/trade'
import { formatNetworkLabel } from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function FundDetailPage() {
  const { recordsScreen, fundRecords, navigateRecords } = usePrototype()
  const record = getFundRecord(recordsScreen?.fundId ?? '', fundRecords)

  if (!record || record.type !== 'withdraw') return null

  const title = recordsCopy.withdrawDetailTitle

  function handleBack() {
    navigateRecords({ screen: 'fund' })
  }

  function shortenAddress(value: string) {
    if (value.length <= 12) return value
    return `${value.slice(0, 6)}...${value.slice(-4)}`
  }

  return (
    <SubPageLayout title={title} onBack={handleBack}>
      <div className="mb-6 text-center">
        <p className="tabular-nums text-h1 font-semibold text-primary">
          −{formatTradeAmount(record.amount, record.coin)} {record.coin}
        </p>
        {record.status === 'completed' && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-body-sm text-success">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            成功
          </div>
        )}
      </div>

      <div className="space-y-4 text-body-sm">
        <DetailRow label="类型" value="普通提币" />
        <DetailRow label="网络" value={formatNetworkLabel(record.chain)} />
        <div className="flex items-start justify-between gap-4">
          <span className="shrink-0 text-secondary">地址</span>
          <div className="min-w-0 text-right">
            <p className="break-all text-primary">{shortenAddress(record.address)}</p>
            <div className="mt-1 flex justify-end gap-3">
              <button type="button" className="text-caption text-brand">
                保存地址
              </button>
              <CopyButton value={record.address} label="复制" />
            </div>
          </div>
        </div>
        {record.txHash !== '—' && (
          <div className="flex items-start justify-between gap-4">
            <span className="shrink-0 text-secondary">交易 ID</span>
            <div className="min-w-0 text-right">
              <p className="break-all text-primary underline decoration-border">
                {record.txHash}
              </p>
              <div className="mt-1 flex justify-end">
                <CopyButton value={record.txHash} label="复制" />
              </div>
            </div>
          </div>
        )}
        <DetailRow label="日期" value={formatRecordTime(record.createdAt)} />
        <DetailRow
          label="手续费"
          value={`${formatTradeAmount(record.fee, record.coin)} ${record.coin}`}
        />
      </div>
    </SubPageLayout>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-secondary">{label}</span>
      <span className="text-right text-primary">{value}</span>
    </div>
  )
}
