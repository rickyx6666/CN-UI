import { useMemo, useState } from 'react'
import { CheckCircle2, ChevronRight, Clock3 } from 'lucide-react'
import { CopyButton } from '../common/CopyButton'
import { PcModalShell } from './PcModalShell'
import {
  formatRecordTime,
  getFundRecord,
  getFundStatusLabel,
  getFundTypeLabel,
  recordsCopy,
  type FundRecordType,
  type RecordsScreenState,
} from '../../data/records'
import { formatTradeAmount } from '../../data/trade'
import { formatNetworkLabel } from '../../data/wallet'
import { usePrototype } from '../../context/PrototypeContext'
import type { PcRecordsModalScreen } from './pcOverlayScreens'

interface PcRecordsModalProps {
  screen: PcRecordsModalScreen
  onClose: () => void
  onNavigate: (screen: RecordsScreenState) => void
}

export function PcRecordsModal({ screen, onClose, onNavigate }: PcRecordsModalProps) {
  if (screen === 'fund-detail') {
    return (
      <PcWithdrawDetailModal
        onClose={() => onNavigate({ screen: 'fund' })}
        onDismiss={onClose}
      />
    )
  }

  if (screen === 'deposit-detail') {
    return (
      <PcDepositDetailModal
        onClose={() => onNavigate({ screen: 'fund' })}
        onDismiss={onClose}
      />
    )
  }

  return (
    <PcModalShell
      title={recordsCopy.fundTitle}
      onClose={onClose}
      maxWidth="max-w-2xl"
      scrollable
    >
      <PcFundHistoryPanel onNavigate={onNavigate} />
    </PcModalShell>
  )
}

type FundFilter = 'all' | FundRecordType

function PcFundHistoryPanel({
  onNavigate,
}: {
  onNavigate: (screen: RecordsScreenState) => void
}) {
  const { fundRecords } = usePrototype()
  const [filter, setFilter] = useState<FundFilter>('all')

  const visible = useMemo(() => {
    if (filter === 'all') return fundRecords
    return fundRecords.filter((r) => r.type === filter)
  }, [fundRecords, filter])

  return (
    <>
      <div className="mb-4 flex gap-2">
        {(
          [
            { id: 'all' as const, label: '全部' },
            { id: 'deposit' as const, label: '充币' },
            { id: 'withdraw' as const, label: '提币' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-3 py-1 text-caption font-medium ${
              filter === item.id
                ? 'bg-brand-muted text-brand'
                : 'bg-sunken text-secondary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-body-sm text-secondary">暂无记录</p>
      ) : (
        <ul className="divide-y divide-border-subtle rounded-lg border border-border-subtle bg-sunken">
          {visible.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() =>
                  onNavigate({
                    screen:
                      record.type === 'deposit' ? 'deposit-detail' : 'fund-detail',
                    fundId: record.id,
                  })
                }
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-elevated"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-medium text-primary">
                    {getFundTypeLabel(record.type)}{' '}
                    <span
                      className={
                        record.type === 'deposit' ? 'text-success' : 'text-danger'
                      }
                    >
                      {record.type === 'deposit' ? '+' : '−'}
                      {formatTradeAmount(record.amount, record.coin)} {record.coin}
                    </span>
                  </p>
                  <p className="mt-0.5 text-caption text-secondary">
                    {record.chain} · {formatRecordTime(record.createdAt)}
                  </p>
                </div>
                <span
                  className={`text-caption ${
                    record.status === 'completed'
                      ? 'text-success'
                      : record.status === 'pending'
                        ? 'text-brand'
                        : 'text-danger'
                  }`}
                >
                  {getFundStatusLabel(record.status)}
                </span>
                <ChevronRight className="h-4 w-4 text-secondary" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function PcWithdrawDetailModal({
  onClose,
  onDismiss,
}: {
  onClose: () => void
  onDismiss: () => void
}) {
  const { recordsScreen, fundRecords } = usePrototype()
  const record = getFundRecord(recordsScreen?.fundId ?? '', fundRecords)

  if (!record || record.type !== 'withdraw') return null

  const title = recordsCopy.withdrawDetailTitle

  function shortenAddress(value: string) {
    if (value.length <= 12) return value
    return `${value.slice(0, 6)}...${value.slice(-4)}`
  }

  return (
    <PcModalShell title={title} onClose={onClose} maxWidth="max-w-lg" scrollable>
      <div className="mb-6 text-center">
        <p className="tabular-nums text-h2 font-semibold text-primary">
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
            <div className="mt-1 flex justify-end">
              <CopyButton value={record.address} label="复制" />
            </div>
          </div>
        </div>
        {record.txHash !== '—' && (
          <div className="flex items-start justify-between gap-4">
            <span className="shrink-0 text-secondary">交易 ID</span>
            <div className="min-w-0 text-right">
              <p className="break-all text-primary">{record.txHash}</p>
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

      <button
        type="button"
        onClick={onDismiss}
        className="mt-6 w-full rounded-md border border-border-subtle py-2.5 text-body-sm text-secondary hover:bg-sunken hover:text-primary"
      >
        关闭
      </button>
    </PcModalShell>
  )
}

function PcDepositDetailModal({
  onClose,
  onDismiss,
}: {
  onClose: () => void
  onDismiss: () => void
}) {
  const { recordsScreen, fundRecords } = usePrototype()
  const record = getFundRecord(recordsScreen?.fundId ?? '', fundRecords)

  if (!record || record.type !== 'deposit') return null

  const confirmations = record.confirmations ?? 0
  const required = record.requiredConfirmations ?? 0
  const confirmationText =
    required > 0 ? `${confirmations}/${required} 次网络确认` : '—'

  return (
    <PcModalShell
      title={recordsCopy.depositDetailTitle}
      onClose={onClose}
      maxWidth="max-w-lg"
      scrollable
    >
      <div className="mb-6 text-center">
        <p className="tabular-nums text-h2 font-semibold text-success">
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
        <DetailRow
          label="到账数量"
          value={`${formatTradeAmount(record.amount, record.coin)} ${record.coin}`}
        />
        <DetailRow label="区块确认" value={confirmationText} />
        <PcAddressRow label="充币地址" value={record.address} />
        {record.fromAddress && (
          <PcAddressRow label="来源地址" value={record.fromAddress} />
        )}
        {record.txHash !== '—' && (
          <PcAddressRow label="交易 ID" value={record.txHash} />
        )}
        <DetailRow label="时间" value={formatRecordTime(record.createdAt)} />
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="mt-6 w-full rounded-md border border-border-subtle py-2.5 text-body-sm text-secondary hover:bg-sunken hover:text-primary"
      >
        关闭
      </button>
    </PcModalShell>
  )
}

function PcAddressRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-secondary">{label}</span>
      <div className="min-w-0 text-right">
        <p className="break-all text-primary">{value}</p>
        <div className="mt-1 flex justify-end">
          <CopyButton value={value} label="复制" />
        </div>
      </div>
    </div>
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
