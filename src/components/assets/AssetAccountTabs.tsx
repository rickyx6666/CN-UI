import { assetPageTabs, type AssetPageTabId } from '../../data/assets'

interface AssetAccountTabsProps {
  active: AssetPageTabId
  onChange: (tabId: AssetPageTabId) => void
}

export function AssetAccountTabs({ active, onChange }: AssetAccountTabsProps) {
  return (
    <div className="layout-screen-x border-b border-border-subtle">
      <div className="flex gap-5 overflow-x-auto scrollbar-none">
        {assetPageTabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative shrink-0 pb-3 pt-3 text-body-sm font-medium transition-colors duration-200 active:opacity-70 ${
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
    </div>
  )
}
