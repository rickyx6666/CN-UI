import { useState } from 'react'
import { ChevronUp, FileText } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import { contractPairLabel, contractPositions } from '../../data/contract'
import { formatUsd } from '../../data/mock'

type ContractPanelTab = 'positions' | 'orders' | 'bot'

interface ContractBottomPanelProps {
  pair: MarketPair
  isLoggedIn: boolean
  onOpenKline?: () => void
}

export function ContractBottomPanel({
  pair,
  isLoggedIn,
  onOpenKline,
}: ContractBottomPanelProps) {
  const [tab, setTab] = useState<ContractPanelTab>('positions')
  const pairPositions = contractPositions.filter((p) => p.symbol === pair.base)
  const positionCount = isLoggedIn ? pairPositions.length : 0

  const tabs: { id: ContractPanelTab; label: string }[] = [
    { id: 'positions', label: `持有仓位(${positionCount})` },
    { id: 'orders', label: '当前委托(0)' },
    { id: 'bot', label: '交易机器人' },
  ]

  return (
    <section className="mt-1 border-t border-border-subtle">
      <div className="flex items-center justify-between border-b border-border-subtle px-3">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative shrink-0 py-2.5 text-caption font-medium ${
                tab === item.id ? 'text-primary' : 'text-secondary'
              }`}
            >
              {item.label}
              {tab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="订单历史"
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-secondary active:opacity-70"
        >
          <FileText className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="min-h-[88px] px-3 py-4">
        {!isLoggedIn ? (
          <p className="text-center text-caption text-secondary">登录后可查看</p>
        ) : tab === 'positions' && positionCount === 0 ? (
          <p className="text-center text-caption text-secondary">暂无持仓</p>
        ) : tab === 'positions' ? (
          <ul className="space-y-3">
            {pairPositions.map((position) => {
              const positive = position.pnlUsd >= 0
              return (
                <li
                  key={position.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-body-sm font-medium text-primary">
                      {position.symbol}USDT 永续
                      <span
                        className={`ml-2 text-caption ${
                          position.side === 'long' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {position.side === 'long' ? '多' : '空'} ·{' '}
                        {position.leverage}x
                      </span>
                    </p>
                    <p className="mt-1 text-caption text-secondary">
                      数量 {position.size} · 保证金 $
                      {formatUsd(position.marginUsd)}
                    </p>
                  </div>
                  <p
                    className={`tabular-nums text-body-sm ${
                      positive ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {positive ? '+' : '−'}${formatUsd(Math.abs(position.pnlUsd))}
                  </p>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-center text-caption text-secondary">暂无数据</p>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenKline}
        className="flex w-full items-center justify-center gap-1 border-t border-border-subtle py-2.5 text-caption text-secondary active:bg-sunken"
      >
        <span>{contractPairLabel(pair)} 图表</span>
        <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </section>
  )
}
