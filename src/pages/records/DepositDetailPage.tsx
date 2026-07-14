import { CheckCircle2, Clock3 } from 'lucide-react'
import { CopyButton } from '../../components/common/CopyButton'
import {
  formatRecordTime,
  getFundRecord,
  getFundStatusLabel,
  recordsCopy,
} from '../../data/records'
import { formatTradeAmount } from '../../data/trade'
import { formatNetworkLabel } from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'

export function DepositDetailPage() {
  const { recordsScreen, fundRecords, navigateRecords } = usePrototype()
  const record = getFundRecord(recordsScreen?.fundId ?? '', fundRecords)

  if (!record || record.type !== 'deposit') return null

  function handleBack() {
    navigateRecords({ screen: 'fund' })
  }

  const confirmations = record.confirmations ?? 0
  const required = record.requiredConfirmations ?? 0
  const confirmationText =
    required > 0 ? `${confirmations}/${required} 次网络确认` : '—'

  return (
    <SubPageLayout title={recordsCopy.depositDetailTitle} onBack={handleBack}>
      <div className="mb-6 text-center">
        <p className="tabular-nums text-h1 font-semibold text-success">
          +{formatTradeAmount(record.amount, record.coin)} {record.coin}
        </p>
        {record.status === 'completed' ? (
          <div className="mt-2 inline-flex items-center gap-1.5 text-body-sm text-success">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            到账成功
          </div>
        ) : (
          <div className="mt-2 inline-flex items-center gap-1.5 text-body-sm text-brand">
            <Clock3 className="h-4 w-4" strokeWidth={2} />
            {getFundStatusLabel(record.status)}
          </div>
        )}
      </div>

      <div className="space-y-4 text-body-sm">
        <DetailRow label="状态" value={getFundStatusLabel(record.status)} />
        <DetailRow label="类型" value="链上充值" />
        <DetailRow label="网络" value={formatNetworkLabel(record.chain)} />
        <DetailRow label="到账数量" value={`${formatTradeAmount(record.amount, record.coin)} ${record.coin}`} />
        <DetailRow label="区块确认" value={confirmationText} />

        <AddressRow label="充币地址" value={record.address} />
        {record.fromAddress && (
          <AddressRow label="来源地址" value={record.fromAddress} />
        )}

        {record.txHash !== '—' && (
          <AddressRow label="交易 ID" value={record.txHash} underline />
        )}

        <DetailRow label="时间" value={formatRecordTime(record.createdAt)} />
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

function AddressRow({
  label,
  value,
  underline,
}: {
  label: string
  value: string
  underline?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-secondary">{label}</span>
      <div className="min-w-0 text-right">
        <p
          className={`break-all text-primary ${
            underline ? 'underline decoration-border' : ''
          }`}
        >
          {value}
        </p>
        <div className="mt-1 flex justify-end">
          <CopyButton value={value} label="复制" />
        </div>
      </div>
    </div>
  )
}
