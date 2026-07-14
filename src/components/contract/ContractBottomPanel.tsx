import { useMemo, useState } from 'react'
import { ChevronUp, FileText } from 'lucide-react'
import type { MarketPair } from '../../data/mock'
import {
  contractOpenOrderCount,
  contractPairLabel,
  contractPositions,
} from '../../data/contract'
import { usePrototype } from '../../context/PrototypeContext'
import { ContractPositionCard } from './ContractPositionCard'

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
  const { openContractHistory } = usePrototype()
  const [tab, setTab] = useState<ContractPanelTab>('positions')
  const [hideOtherContracts, setHideOtherContracts] = useState(false)

  const visiblePositions = useMemo(() => {
    if (!isLoggedIn) return []
    if (hideOtherContracts) {
      return contractPositions.filter((p) => p.symbol === pair.base)
    }
    return contractPositions
  }, [hideOtherContracts, isLoggedIn, pair.base])

  const positionCount = isLoggedIn ? contractPositions.length : 0

  const tabs: { id: ContractPanelTab; label: string }[] = [
    { id: 'positions', label: `持有仓位 (${positionCount})` },
    { id: 'orders', label: `当前委托 (${contractOpenOrderCount})` },
    { id: 'bot', label: '交易机器人' },
  ]

  return (
    <section className="mt-1 border-t border-border-subtle">
      <div className="flex items-center justify-between border-b border-border-subtle px-3">
        <div className="flex gap-3 overflow-x-auto">
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
          aria-label="合约账单"
          onClick={openContractHistory}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-secondary active:opacity-70"
        >
          <FileText className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {tab === 'positions' && isLoggedIn && (
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
          <label className="flex items-center gap-2 text-[10px] text-secondary">
            <input
              type="checkbox"
              checked={hideOtherContracts}
              onChange={(e) => setHideOtherContracts(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-brand"
            />
            隐藏其他合约
          </label>
          <button
            type="button"
            className="text-[10px] font-medium text-primary active:opacity-70"
          >
            一键平仓
          </button>
        </div>
      )}

      <div className="min-h-[72px] px-3">
        {!isLoggedIn ? (
          <p className="py-8 text-center text-caption text-secondary">
            登录后可查看
          </p>
        ) : tab === 'positions' ? (
          visiblePositions.length === 0 ? (
            <p className="py-8 text-center text-caption text-secondary">
              暂无持仓
            </p>
          ) : (
            <div>
              {visiblePositions.map((position) => (
                <ContractPositionCard key={position.id} position={position} />
              ))}
            </div>
          )
        ) : tab === 'orders' ? (
          <p className="py-8 text-center text-caption text-secondary">
            暂无委托
          </p>
        ) : (
          <p className="py-8 text-center text-caption text-secondary">
            暂无机器人
          </p>
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
