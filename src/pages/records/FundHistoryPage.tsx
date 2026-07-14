import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  formatRecordTime,
  getFundStatusLabel,
  getFundTypeLabel,
  recordsCopy,
  type FundRecordType,
} from '../../data/records'
import { usePrototype } from '../../context/PrototypeContext'
import { SubPageLayout } from '../../components/account/SubPageLayout'
import { formatTradeAmount } from '../../data/trade'

type FundFilter = 'all' | FundRecordType

export function FundHistoryPage() {
  const { fundRecords, closeRecords, navigateRecords } = usePrototype()
  const [filter, setFilter] = useState<FundFilter>('all')

  const visible = useMemo(() => {
    if (filter === 'all') return fundRecords
    return fundRecords.filter((r) => r.type === filter)
  }, [fundRecords, filter])

  return (
    <SubPageLayout title={recordsCopy.fundTitle} onBack={closeRecords}>
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
        <ul className="divide-y divide-border-subtle rounded-lg border border-border-subtle bg-elevated">
          {visible.map((record) => (
            <li key={record.id}>
              <button
                type="button"
                onClick={() =>
                  navigateRecords({
                    screen:
                      record.type === 'deposit' ? 'deposit-detail' : 'fund-detail',
                    fundId: record.id,
                  })
                }
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-sunken"
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
    </SubPageLayout>
  )
}
