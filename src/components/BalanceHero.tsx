import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { PortfolioSummary, UserProfile } from '../data/mock'
import { formatChangePercent, formatUsd, getKycLabel } from '../data/mock'
import { usePrototype } from '../context/PrototypeContext'

interface BalanceHeroProps {
  portfolio: PortfolioSummary
  user: UserProfile
}

export function BalanceHero({ portfolio, user }: BalanceHeroProps) {
  const { navigateAccount } = usePrototype()
  const [visible, setVisible] = useState(true)
  const isPositive = portfolio.pnl24hPercent >= 0

  return (
    <section className="layout-screen-x pb-4 pt-5">
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-body-sm text-secondary">总资产 (USD)</span>
        <button
          type="button"
          aria-label={visible ? '隐藏余额' : '显示余额'}
          onClick={() => setVisible((v) => !v)}
          className="flex h-7 w-7 items-center justify-center text-secondary active:opacity-70"
        >
          {visible ? (
            <Eye className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <EyeOff className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <p className="tabular-nums text-[32px] font-semibold leading-tight tracking-tight text-primary">
        {visible ? `$${formatUsd(portfolio.totalUsd)}` : '••••••'}
      </p>

      <p
        className={`mt-1 tabular-nums text-body-sm ${
          isPositive ? 'text-success' : 'text-danger'
        }`}
      >
        {visible ? (
          <>
            {isPositive ? '+' : '−'}${formatUsd(Math.abs(portfolio.pnl24hUsd))}{' '}
            ({formatChangePercent(portfolio.pnl24hPercent)}) · 24h
          </>
        ) : (
          '••••'
        )}
      </p>

      {user.isLoggedIn && user.kycStatus !== 'verified' && (
        <button
          type="button"
          className="mt-3 text-body-sm text-brand active:opacity-70"
          onClick={() => navigateAccount({ screen: 'kyc' })}
        >
          身份认证 · {getKycLabel(user.kycStatus)} →
        </button>
      )}
    </section>
  )
}
