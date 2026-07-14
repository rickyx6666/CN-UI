import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { formatCoinDetailAmount } from '../../data/assetCoinDetail'

interface CoinDetailBalanceCardProps {
  symbol: string
  available: number
  locked: number
}

export function CoinDetailBalanceCard({
  symbol,
  available,
  locked,
}: CoinDetailBalanceCardProps) {
  const [visible, setVisible] = useState(true)
  const total = available + locked

  return (
    <section className="rounded-xl bg-elevated px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-body-sm text-secondary">余额</span>
        <button
          type="button"
          aria-label={visible ? '隐藏余额' : '显示余额'}
          onClick={() => setVisible((value) => !value)}
          className="flex h-8 w-8 items-center justify-center text-secondary active:opacity-70"
        >
          {visible ? (
            <Eye className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <EyeOff className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <p className="tabular-nums text-[32px] font-semibold leading-none text-primary">
        {visible ? formatCoinDetailAmount(total, symbol) : '••••••'}
      </p>

      <div className="mt-5 space-y-3 text-body-sm">
        <BalanceRow
          label="可用"
          value={visible ? formatCoinDetailAmount(available, symbol) : '••••'}
        />
        <BalanceRow
          label="锁定"
          value={visible ? formatCoinDetailAmount(locked, symbol) : '••••'}
        />
      </div>
    </section>
  )
}

function BalanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-secondary">{label}</span>
      <span className="tabular-nums text-primary">{value}</span>
    </div>
  )
}
