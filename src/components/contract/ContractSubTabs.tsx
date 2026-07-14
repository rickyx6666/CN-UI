import { Menu } from 'lucide-react'
import { contractMarketTabs, type ContractMarketType } from '../../data/contract'

interface ContractSubTabsProps {
  active: ContractMarketType
  onChange: (type: ContractMarketType) => void
}

export function ContractSubTabs({ active, onChange }: ContractSubTabsProps) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-3">
      <div className="flex gap-4 overflow-x-auto">
        {contractMarketTabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative shrink-0 py-2.5 text-caption font-medium transition-colors active:opacity-70 ${
                isActive ? 'text-primary' : 'text-secondary'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        aria-label="更多"
        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-secondary active:opacity-70"
      >
        <Menu className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  )
}
