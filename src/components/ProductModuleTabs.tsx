import type { ProductModule } from '../data/productModule'
import { productModuleTabs } from '../data/productModule'

interface ProductModuleTabsProps {
  active: ProductModule
  onChange: (module: ProductModule) => void
  className?: string
}

export function ProductModuleTabs({
  active,
  onChange,
  className = '',
}: ProductModuleTabsProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {productModuleTabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative py-3 text-caption font-medium transition-colors duration-200 active:opacity-70 ${
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
  )
}
